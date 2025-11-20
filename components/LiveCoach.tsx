import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, X } from 'lucide-react';
import { connectToLiveSession, createAudioBlob, decodeAudioData, base64ToUint8Array } from '../services/geminiService';
import { LiveSession, LiveServerMessage } from '@google/genai';

interface LiveCoachProps {
  onClose: () => void;
}

const LiveCoach: React.FC<LiveCoachProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const sessionRef = useRef<LiveSession | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const videoIntervalRef = useRef<number | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Clean up function
  const cleanup = () => {
    if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (sessionRef.current) {
      sessionRef.current.close();
    }

    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
  };

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        // Setup Audio Contexts
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

        // Get Media Stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: {
            channelCount: 1,
            sampleRate: 16000,
          } 
        });
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Process Microphone Input
        const source = inputAudioContextRef.current.createMediaStreamSource(stream);
        const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
        
        processor.onaudioprocess = (e) => {
          if (!sessionRef.current) return;
          
          const inputData = e.inputBuffer.getChannelData(0);
          const blob = createAudioBlob(inputData);
          
          // Send audio chunk
          sessionRef.current.sendRealtimeInput({
            media: {
              mimeType: blob.mimeType,
              data: blob.data
            }
          });
        };

        source.connect(processor);
        processor.connect(inputAudioContextRef.current.destination);

        // Connect to Gemini
        const session = await connectToLiveSession(
          // onOpen
          () => {
            if(mounted) setIsConnected(true);
            console.log("Gemini Live Connected");
          },
          // onMessage
          async (message: LiveServerMessage) => {
            if (!audioContextRef.current) return;

            const serverContent = message.serverContent;
            
            // Handle Audio Output
            const audioData = serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                base64ToUint8Array(audioData),
                ctx
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Interruption
            if (serverContent?.interrupted) {
               sourcesRef.current.forEach(source => source.stop());
               sourcesRef.current.clear();
               nextStartTimeRef.current = 0;
            }
          },
          // onClose
          () => {
            if(mounted) setIsConnected(false);
            console.log("Session Closed");
          },
          // onError
          (e) => {
            console.error("Gemini Error", e);
            if(mounted) setErrorMessage("Connection lost or API key invalid.");
          }
        );
        
        sessionRef.current = session;

        // --- Video Streaming Loop ---
        videoIntervalRef.current = window.setInterval(() => {
          if (!sessionRef.current || !videoRef.current || !canvasRef.current || !isCameraOn) return;
          
          const canvas = canvasRef.current;
          const video = videoRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx && video.videoWidth > 0) {
            canvas.width = video.videoWidth * 0.25; // Downscale for bandwidth
            canvas.height = video.videoHeight * 0.25;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const base64 = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
            
            sessionRef.current.sendRealtimeInput({
              media: {
                mimeType: 'image/jpeg',
                data: base64
              }
            });
          }
        }, 1000); // 1 FPS is usually sufficient for pose analysis to save tokens/bw

      } catch (err: any) {
        console.error(err);
        if (mounted) setErrorMessage(err.message || "Failed to initialize media");
      }
    };

    initSession();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []); // Run once on mount

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => t.enabled = !isCameraOn);
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => t.enabled = !isMicOn);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black to-transparent z-10 absolute top-0 w-full">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <h2 className="text-white font-bold tracking-widest">DEEPGETTY <span className="font-serif italic font-normal text-blue-400">LIVE</span></h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <X className="text-white w-6 h-6" />
        </button>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative bg-zinc-900 flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`} 
        />
        
        {!isCameraOn && (
          <div className="text-gray-500 flex flex-col items-center">
            <VideoOff className="w-16 h-16 mb-4 opacity-50" />
            <p>Camera Paused</p>
          </div>
        )}

        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* AI Avatar Overlay / UI */}
        <div className="absolute bottom-32 left-6 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 max-w-xs">
          <h3 className="text-blue-400 text-xs font-bold uppercase mb-1">AI Analysis</h3>
          <p className="text-white text-sm leading-relaxed">
            {isConnected ? "Analyzing form and posture. I'm listening..." : "Connecting to neural network..."}
          </p>
        </div>
        
        {errorMessage && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/80 p-6 rounded-xl text-white text-center">
             <p className="font-bold mb-2">Connection Error</p>
             <p className="text-sm">{errorMessage}</p>
             <button onClick={onClose} className="mt-4 px-4 py-2 bg-white text-black rounded-lg text-sm">Close</button>
           </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-24 bg-zinc-950 border-t border-zinc-900 flex items-center justify-center gap-6">
        <button 
          onClick={toggleMic}
          className={`p-4 rounded-full transition-all ${isMicOn ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-red-500'}`}
        >
          {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>
        
        <button 
          onClick={toggleCamera}
          className={`p-4 rounded-full transition-all ${isCameraOn ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-red-500'}`}
        >
          {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        <div className="w-px h-10 bg-zinc-800 mx-2" />

        <button className="p-4 rounded-full bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20">
          <Camera className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default LiveCoach;