
import React, { useState } from 'react';
import { ChevronRight, Activity, Dna, Globe, PlayCircle, ArrowRight, LogIn } from 'lucide-react';
import BodyScan from './BodyScan';

interface HomeProps {
  onJoin: () => void;
  onLogin: () => void;
  heroVideoUrl: string;
}

const Home: React.FC<HomeProps> = ({ onJoin, onLogin, heroVideoUrl }) => {
  const [showDemoScan, setShowDemoScan] = useState(false);

  // NUCLEAR OPTION: We inject the video tag as raw HTML.
  // This bypasses React's render cycle delay which often causes modern browsers
  // to block autoplay because the 'muted' attribute isn't registered fast enough.
  const videoHtml = `
    <video 
      class="absolute inset-0 w-full h-full object-cover z-0"
      src="${heroVideoUrl}" 
      autoplay 
      loop 
      muted 
      playsinline
      webkit-playsinline
    ></video>
  `;

  if (showDemoScan) {
    return <BodyScan onClose={() => setShowDemoScan(false)} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-white overflow-x-hidden bg-deep-black">
      
      {/* Hero Section with Video Background */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        
        {/* Direct HTML Injection for Video Reliability */}
        <div dangerouslySetInnerHTML={{ __html: videoHtml }} />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-deep-black z-10" />

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-6xl md:text-9xl font-serif font-bold tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 drop-shadow-2xl">
            DEEPGETTY
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-10 font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 drop-shadow-md">
            The operating system for human potential. <br/>
            Studio. Go. Life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <button 
              onClick={onJoin}
              className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
            >
              Start 24h Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onLogin}
              className="bg-black/30 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              Member Login <LogIn className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
           <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
             <div className="w-1 h-2 bg-white rounded-full" />
           </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="bg-deep-black py-24 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-blue-500 mx-auto md:mx-0">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">The Studio</h3>
              <p className="text-gray-400 leading-relaxed">
                Twelve elite disciplines. Five areas per discipline. 500+ routines powered by AI vision correction.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-red-500 mx-auto md:mx-0">
                <Dna className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">DeepGetty Life</h3>
              <p className="text-gray-400 leading-relaxed">
                Cellular optimization. Access elite peptide protocols and bloodwork analysis directly from your dashboard.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-green-500 mx-auto md:mx-0">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">DeepGetty Go</h3>
              <p className="text-gray-400 leading-relaxed">
                Take the system with you. Audio-guided immersive sessions for running, hiking, and travel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlight - AI */}
      <div className="bg-zinc-900 py-24 px-6 border-y border-zinc-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
           <div>
             <h2 className="text-5xl font-serif font-bold text-white mb-6">
               It sees you.<br/>It guides you.
             </h2>
             <p className="text-xl text-gray-400 mb-8">
               Our proprietary AI Vision engine analyzes your form in real-time through your device's camera. No wearables required. Just you and the machine.
             </p>
             <button onClick={() => setShowDemoScan(true)} className="flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
               Start Live Demo <ChevronRight className="w-5 h-5" />
             </button>
           </div>
           <div className="relative cursor-pointer" onClick={() => setShowDemoScan(true)}>
             <div className="aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl hover:border-blue-500 transition-colors">
               {/* Simulated scanning UI */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(0,100,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <PlayCircle className="w-16 h-16 text-white opacity-50" />
               </div>
               <div className="absolute top-4 right-4 bg-blue-600 text-xs font-bold px-2 py-1 rounded">
                 CLICK TO TEST
               </div>
             </div>
             <div className="absolute -bottom-6 -left-6 bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-xl">
               <div className="text-sm font-bold text-gray-400 uppercase mb-1">Correction</div>
               <div className="text-lg text-white font-bold">"Lower your hips."</div>
             </div>
           </div>
        </div>
      </div>

      {/* Pricing Teaser */}
      <div className="bg-black py-24 px-6 text-center">
        <h2 className="text-4xl font-serif font-bold text-white mb-6">Total Access</h2>
        <div className="text-6xl font-bold text-white mb-2">$97<span className="text-2xl text-gray-500">/mo</span></div>
        <p className="text-gray-400 mb-10">Includes a 24-hour full access trial. Cancel anytime.</p>
        <button 
          onClick={onJoin}
          className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
        >
          Join the Collective
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-deep-black border-t border-zinc-900 py-12 text-center text-xs text-gray-600">
        <div className="font-serif font-bold text-white text-2xl mb-4">DG.</div>
        <p>© 2025 DeepGetty Corp. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
          <span className="cursor-pointer hover:text-white transition-colors">Terms</span>
          <span className="cursor-pointer hover:text-white transition-colors">HIPAA</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
