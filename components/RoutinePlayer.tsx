import React, { useEffect, useRef, useState } from 'react';
import { Routine } from '../types';
import { X, Mic, MicOff, Video, VideoOff, Activity, Volume2, Disc, Download, StopCircle } from 'lucide-react';
import { connectToLiveSession, createAudioBlob, decodeAudioData, base64ToUint8Array } from '../services/geminiService';
import { LiveSession, LiveServerMessage } from '@google/genai';

interface RoutinePlayerProps {
  routine: Routine;
  onClose: () => void;
}

const RoutinePlayer: React.FC<RoutinePlayerProps> = ({ routine, onClose }) => {
  // UI State
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  // Refs for Media & AI
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<LiveSession | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const videoIntervalRef = useRef<number | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Cleanup Logic
  const cleanup = () => {
    if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    if (sessionRef.current) sessionRef.current.close();
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
  };

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        // 1. Setup Audio
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

        // 2. Get Media Stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: { channelCount: 1, sampleRate: 16000 } 
        });
        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }

        // 3. Process Microphone for AI
        const source = inputAudioContextRef.current.createMediaStreamSource(stream);
        const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
        
        processor.onaudioprocess = (e) => {
          if (!sessionRef.current) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const blob = createAudioBlob(inputData);
          sessionRef.current.sendRealtimeInput({
            media: { mimeType: blob.mimeType, data: blob.data }
          });
        };
        source.connect(processor);
        processor.connect(inputAudioContextRef.current.destination);

        // 4. Connect to Gemini with Routine Context
        const systemPrompt = `
          You are DeepGetty, an elite AI fitness instructor. 
          The user is currently performing the routine: "${routine.title}".
          This routine has ${routine.steps.length} steps.
          Step 1 is "${routine.steps[0].title}".
          
          You are watching the user through their camera. 
          Your job is to:
          1. Briefly welcome them to the "${routine.title}" class.
          2. Guide them through the movements.
          3. Correct their form based on what you see in the video feed.
          4. Be high-energy but focused. 
          
          If the user stops moving, encourage them. 
          If they ask "What's next?", tell them the next step.
        `;

        const session = await connectToLiveSession(
          () => { if(mounted) setIsConnected(true); },
          async (message: LiveServerMessage) => {
            if (!audioContextRef.current) return;
            const serverContent = message.serverContent;
            
            // Audio Output
            const audioData = serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(base64ToUint8Array(audioData), ctx);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Interruption
            if (serverContent?.interrupted) {
               sourcesRef.current.forEach(source => source.stop());
               sourcesRef.current.clear();
               nextStartTimeRef.current = 0;
            }
          },
          () => { if(mounted) setIsConnected(false); },
          (e) => { if(mounted) setErrorMessage("Connection lost."); },
          systemPrompt
        );
        
        sessionRef.current = session;

        // 5. Video Streaming to AI
        videoIntervalRef.current = window.setInterval(() => {
          if (!sessionRef.current || !userVideoRef.current || !canvasRef.current || !isCameraOn) return;
          const canvas = canvasRef.current;
          const video = userVideoRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx && video.videoWidth > 0) {
            canvas.width = video.videoWidth * 0.25; 
            canvas.height = video.videoHeight * 0.25;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
            sessionRef.current.sendRealtimeInput({
              media: { mimeType: 'image/jpeg', data: base64 }
            });
          }
        }, 1000);

      } catch (err: any) {
        console.error(err);
        if (mounted) setErrorMessage("Failed to access camera/mic. Please allow permissions.");
      }
    };

    initSession();
    return () => { mounted = false; cleanup(); };
  }, [routine]);

  // Toggle handlers
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (streamRef.current) streamRef.current.getAudioTracks().forEach(t => t.enabled = !isMicOn);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (streamRef.current) streamRef.current.getVideoTracks().forEach(t => t.enabled = !isCameraOn);
  };

  // Recording Handlers
  const startRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = `deepgetty-session-${new Date().toISOString()}.webm`;
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordingTime(0);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);

    // Auto stop after 5 mins (300s)
    let seconds = 0;
    recordingTimerRef.current = window.setInterval(() => {
      seconds++;
      setRecordingTime(seconds);
      if (seconds >= 300) {
        stopRecording();
      }
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in zoom-in duration-300">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
           <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
             <X className="w-6 h-6" />
           </button>
           <div>
             <h2 className="text-white font-bold text-xl">{routine.title}</h2>
             <div className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
               <span className="text-xs text-gray-300 uppercase tracking-widest">
                 {isConnected ? 'AI Coach Active' : 'Connecting...'}
               </span>
             </div>
           </div>
        </div>
        
        <div className="flex gap-2">
          {/* Simulating Step Progress */}
          {routine.steps.map((step, i) => (
            <div key={step.id} className={`h-1 w-8 rounded-full transition-colors ${i <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-700'}`} />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex">
        
        {/* Left: The Class Video (Simulated) */}
        <div className="flex-1 relative bg-zinc-900 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
             {/* In a real app, this would be <video src={classUrl} /> */}
             <div className="text-center opacity-20">
               <Activity className="w-32 h-32 mx-auto mb-4 text-white" />
               <h1 className="text-6xl font-serif font-bold text-white">CLASS IN SESSION</h1>
             </div>
          </div>
          
          {/* Audio Visualizer Overlay (Simulated) */}
          {isConnected && (
            <div className="absolute bottom-12 left-12 flex items-end gap-1 h-8">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="w-1 bg-blue-400 animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: '0.5s' }} />
               ))}
               <span className="ml-2 text-blue-400 text-xs font-bold">DEEPGETTY SPEAKING...</span>
            </div>
          )}
        </div>

        {/* Right: User Camera (PiP style or Split) - Let's do floating PiP for "Studio" feel */}
        <div className="absolute bottom-8 right-8 w-64 aspect-[3/4] bg-black rounded-xl overflow-hidden border-2 border-zinc-800 shadow-2xl shadow-black/50">
          <video 
            ref={userVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className={`w-full h-full object-cover ${isCameraOn ? 'opacity-100' : 'opacity-0'}`} 
          />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
              <VideoOff className="text-gray-600" />
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Self View Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex justify-center gap-4">
             <button onClick={toggleMic} className="text-white hover:text-blue-400">
               {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-red-500" />}
             </button>
             <button onClick={toggleCamera} className="text-white hover:text-blue-400">
               {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-500" />}
             </button>
             
             {/* Recording Button */}
             {!isRecording ? (
               <button onClick={startRecording} className="text-red-500 hover:text-red-400" title="Record 5m Clip">
                 <Disc className="w-4 h-4" />
               </button>
             ) : (
               <button onClick={stopRecording} className="text-white animate-pulse" title="Stop Recording">
                 <StopCircle className="w-4 h-4" />
               </button>
             )}
          </div>
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              REC {formatTime(recordingTime)}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/90 text-white p-6 rounded-xl text-center">
            <p>{errorMessage}</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-white text-black rounded-lg text-sm">Close</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RoutinePlayer;