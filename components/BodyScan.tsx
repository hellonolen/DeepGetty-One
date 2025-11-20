import React, { useEffect, useRef, useState } from 'react';
import { Camera, ScanLine, CheckCircle, Loader2 } from 'lucide-react';

interface BodyScanProps {
  onClose: () => void;
}

const BodyScan: React.FC<BodyScanProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error("Camera error", e);
      }
    };
    startCamera();
    
    return () => {
      // Cleanup tracks
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startScan = () => {
    setScanning(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setScanning(false);
        setComplete(true);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
       
       {/* Header */}
       <div className="absolute top-8 left-0 w-full text-center z-20">
         <h2 className="text-2xl font-serif font-bold text-white">Body Composition Scan</h2>
         <p className="text-gray-400 text-sm">Stand 6 feet back. Wear minimal clothing for best accuracy.</p>
       </div>

       {/* Camera Viewport */}
       <div className="relative h-[80vh] aspect-[9/16] md:aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-blue-900/20">
         <video 
           ref={videoRef} 
           autoPlay 
           muted 
           playsInline 
           className="w-full h-full object-cover"
         />
         
         {/* Overlay Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

         {/* Scanning Beam */}
         {scanning && (
            <div className="absolute left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-scan" 
                 style={{ top: `${progress}%` }} />
         )}

         {/* UI Controls */}
         {!scanning && !complete && (
           <div className="absolute bottom-10 left-0 w-full flex justify-center">
             <button 
               onClick={startScan}
               className="bg-white text-black rounded-full px-8 py-4 font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-3"
             >
               <ScanLine className="w-6 h-6" />
               Start Scan
             </button>
           </div>
         )}

         {scanning && (
           <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-2">
             <div className="bg-black/60 px-4 py-2 rounded-full backdrop-blur-md text-white font-mono text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                Analyzing Posture... {progress}%
             </div>
           </div>
         )}

         {complete && (
           <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
              <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
              <h3 className="text-3xl font-bold text-white mb-2">Scan Complete</h3>
              <p className="text-gray-400 mb-8">Biometrics updated. Posture alignment improved by 2% since last week.</p>
              <button 
                onClick={onClose}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors"
              >
                Return to Dashboard
              </button>
           </div>
         )}
       </div>

       <style>{`
         @keyframes scan {
           0% { top: 0%; }
           50% { top: 100%; }
           100% { top: 0%; }
         }
         .animate-scan {
           animation: scan 3s linear infinite;
         }
       `}</style>
    </div>
  );
};

export default BodyScan;