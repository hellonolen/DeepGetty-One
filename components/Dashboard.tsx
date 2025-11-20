import React from 'react';
import { Calendar as CalendarIcon, Activity, Zap, Target, ArrowRight, ScanLine } from 'lucide-react';
import { DISCIPLINES } from '../constants';
import { Routine } from '../types';

interface DashboardProps {
  onNavigate: (view: any) => void; // Using generic type for simplicity in this view
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Mock data for calendar
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDay = 'Wed';
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Welcome back, Initiate.</h1>
          <p className="text-gray-400">Your biometrics are optimized for today's sequence.</p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-2xl font-bold text-white">14 Day</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Streak</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Schedule & Active */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Action: Body Scan */}
          <div className="bg-gradient-to-r from-zinc-900 to-blue-900/20 border border-blue-500/30 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group cursor-pointer"
               onClick={() => onNavigate('BODY_SCAN')}>
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-1">Scan Body Composition</h3>
              <p className="text-blue-200 text-sm">Update your 3D avatar and alignment metrics.</p>
            </div>
            <div className="relative z-10 bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-900/50 group-hover:scale-110 transition-transform">
              <ScanLine className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-400" /> 
                This Week
              </h3>
              <span className="text-xs text-gray-500">October 2025</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center mb-6">
              {weekDays.map((day, i) => (
                <div key={day} className={`space-y-2 ${day === currentDay ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="text-xs text-gray-500 font-bold">{day}</div>
                  <div className={`h-24 rounded-xl border ${
                    day === currentDay 
                      ? 'bg-zinc-800 border-blue-500 relative shadow-lg shadow-blue-900/20' 
                      : 'bg-zinc-950 border-zinc-800'
                  } flex flex-col items-center justify-center p-2`}>
                    {/* Mock Status Dots */}
                    {i < 2 && <div className="w-1.5 h-1.5 rounded-full bg-green-500 mb-1" />}
                    {day === currentDay && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mb-1" />}
                    
                    <span className={`text-sm font-bold ${day === currentDay ? 'text-white' : 'text-gray-600'}`}>
                      {21 + i}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-6">
               <h4 className="text-sm font-bold text-white mb-4">Scheduled for Today</h4>
               <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
                    onClick={() => onNavigate('STUDIO')}>
                 <div className="flex items-center gap-4">
                    <img src={DISCIPLINES[0].image} className="w-12 h-12 rounded-lg object-cover grayscale" alt="Flow" />
                    <div>
                       <div className="font-bold text-white">Kinetic Flow: Foundation</div>
                       <div className="text-xs text-gray-500">10:00 AM • 45 Min</div>
                    </div>
                 </div>
                 <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-200">
                   Start
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* Side Column: Stats & Suggestions */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6">Biometrics</h3>
            <div className="space-y-6">
               <div>
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-400">Recovery Score</span>
                   <span className="text-green-400 font-bold">92%</span>
                 </div>
                 <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500 w-[92%]" />
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-400">Strain</span>
                   <span className="text-blue-400 font-bold">14.5</span>
                 </div>
                 <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[60%]" />
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-400">Sleep</span>
                   <span className="text-white font-bold">7h 12m</span>
                 </div>
                 <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-gray-500 w-[75%]" />
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Suggested</h3>
            <div className="space-y-3">
               <div className="p-3 bg-black/50 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-zinc-800 transition-colors"
                    onClick={() => onNavigate('STUDIO')}>
                 <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400">
                   <Target className="w-4 h-4" />
                 </div>
                 <div>
                   <div className="text-sm font-bold text-white">Restorative Touch</div>
                   <div className="text-xs text-gray-500">Couples Sync • 20m</div>
                 </div>
               </div>
               <div className="p-3 bg-black/50 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-zinc-800 transition-colors"
                    onClick={() => onNavigate('STUDIO')}>
                 <div className="p-2 bg-orange-900/20 rounded-lg text-orange-400">
                   <Zap className="w-4 h-4" />
                 </div>
                 <div>
                   <div className="text-sm font-bold text-white">Velocity</div>
                   <div className="text-xs text-gray-500">Ignite • 15m</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;