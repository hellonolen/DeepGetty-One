
import React, { useState } from 'react';
import { MapPin, Zap, Activity, Headphones, Watch, Smartphone, Link2, ArrowRight, ChevronRight } from 'lucide-react';
import RoutinePlayer from './RoutinePlayer';
import { Routine } from '../types';

const DeepGettyGo: React.FC = () => {
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');
  const [activeAudioSession, setActiveAudioSession] = useState<Routine | null>(null);

  const toggleDevice = (device: string) => {
    if (connectedDevices.includes(device)) {
      setConnectedDevices(connectedDevices.filter(d => d !== device));
    } else {
      setConnectedDevices([...connectedDevices, device]);
    }
  };

  const startCustomSession = () => {
    if (!customActivity) return;
    const dummyRoutine: Routine = {
      id: `custom-${Date.now()}`,
      title: customActivity,
      difficulty: 'Intermediate',
      steps: [{ id: '1', title: 'Start', duration: 'N/A', description: 'Go' }]
    };
    setActiveAudioSession(dummyRoutine);
  };

  if (activeAudioSession) {
    return <RoutinePlayer routine={activeAudioSession} onClose={() => setActiveAudioSession(null)} />;
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-serif font-bold text-white mb-4">DeepGetty <span className="text-blue-500">Go</span></h1>
        <p className="text-xl text-gray-400">Real-time performance tracking across all environments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Actions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions Grid */}
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-green-500 transition-all">
               <div className="absolute inset-0 bg-zinc-900 group-hover:bg-zinc-800 transition-colors" />
               <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <Activity className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-white mb-1">Outdoor Run</h3>
                  <p className="text-sm text-gray-400">GPS Tracking • Audio Guide</p>
               </div>
            </div>
            
            <div className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-yellow-500 transition-all">
               <div className="absolute inset-0 bg-zinc-900 group-hover:bg-zinc-800 transition-colors" />
               <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <Zap className="w-12 h-12 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-white mb-1">HIIT Interval</h3>
                  <p className="text-sm text-gray-400">Voice Only • High Intensity</p>
               </div>
            </div>
          </div>

          {/* Manual Entry */}
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Custom Activity Protocol</h3>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Enter Discipline (e.g. Fencing, Rucking)" 
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                className="flex-1 bg-black border border-zinc-700 rounded-xl px-6 text-lg text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={startCustomSession}
                disabled={!customActivity}
                className="bg-blue-600 text-white px-8 rounded-xl disabled:opacity-50 hover:bg-blue-500 transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Integrations & Nearby */}
        <div className="space-y-8">
          
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Device Ecosystem</h3>
            <div className="grid grid-cols-1 gap-3">
               {[
                 { id: 'apple', name: 'Apple Health', icon: Activity },
                 { id: 'whoop', name: 'Whoop 4.0', icon: Watch },
                 { id: 'oura', name: 'Oura Ring', icon: Link2 },
               ].map(device => (
                 <div key={device.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors cursor-pointer" onClick={() => toggleDevice(device.id)}>
                   <div className="flex items-center gap-4">
                     <div className={`p-2 rounded-lg ${connectedDevices.includes(device.id) ? 'bg-blue-900/30 text-blue-400' : 'bg-black text-gray-500'}`}>
                       <device.icon className="w-5 h-5" />
                     </div>
                     <span className={`font-bold ${connectedDevices.includes(device.id) ? 'text-white' : 'text-gray-400'}`}>{device.name}</span>
                   </div>
                   <div className={`w-3 h-3 rounded-full ${connectedDevices.includes(device.id) ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`} />
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-gradient-to-b from-blue-900/20 to-transparent rounded-2xl p-6 border border-blue-500/20">
             <div className="flex items-center gap-3 mb-4">
               <Headphones className="w-6 h-6 text-blue-400" />
               <h3 className="font-bold text-white">Audio Immersive</h3>
             </div>
             <p className="text-sm text-gray-400 mb-6 leading-relaxed">
               Activate pure voice guidance. Your AI coach will guide you through your environment using spatial awareness.
             </p>
             <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
               Start Audio Mode
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeepGettyGo;
