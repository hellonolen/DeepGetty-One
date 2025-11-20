import React, { useState } from 'react';
import { DISCIPLINES } from '../constants';
import { Discipline, Area, Routine } from '../types';
import { ChevronRight, PlayCircle, ArrowLeft, Activity } from 'lucide-react';

interface StudioProps {
  onStartRoutine: (routine: Routine) => void;
}

const Studio: React.FC<StudioProps> = ({ onStartRoutine }) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const resetSelection = () => {
    setSelectedArea(null);
    setSelectedDiscipline(null);
  };

  // Level 3: Routines
  if (selectedArea && selectedDiscipline) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedArea(null)}
          className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to {selectedDiscipline.title} Areas
        </button>
        
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-white mb-2">{selectedArea.title}</h2>
          <p className="text-gray-400">Select a routine to begin your practice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedArea.routines.map((routine) => (
            <div 
              key={routine.id}
              onClick={() => onStartRoutine(routine)}
              className="group relative p-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  routine.difficulty === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                  routine.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {routine.difficulty}
                </span>
                <PlayCircle className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{routine.title}</h3>
              <div className="text-sm text-gray-500">
                {routine.steps.length} Steps • Guided
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Level 2: Areas
  if (selectedDiscipline) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedDiscipline(null)}
          className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Disciplines
        </button>

        <div className="flex flex-col md:flex-row gap-8 mb-10 items-end">
          <img 
            src={selectedDiscipline.image} 
            alt={selectedDiscipline.title}
            className="w-32 h-32 object-cover rounded-xl shadow-2xl shadow-blue-900/20" 
          />
          <div>
            <h2 className="text-5xl font-serif font-bold text-white mb-2">{selectedDiscipline.title}</h2>
            <p className="text-xl text-gray-400 max-w-2xl">{selectedDiscipline.description}</p>
          </div>
        </div>

        <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6 font-semibold">Select an Area</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {selectedDiscipline.areas.map((area, idx) => (
            <div 
              key={area.id}
              onClick={() => setSelectedArea(area)}
              className="relative group aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-800"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-6xl font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors absolute top-4 right-4 select-none">
                  0{idx + 1}
                </span>
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors relative z-10">
                  {area.title}
                </h3>
                <div className="flex items-center text-sm text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  View Routines <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Level 1: Disciplines
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">The Studio</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Elite disciplines. Five areas. Infinite potential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DISCIPLINES.map((discipline) => (
          <div 
            key={discipline.id}
            onClick={() => setSelectedDiscipline(discipline)}
            className="group relative h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer"
          >
            <img 
              src={discipline.image} 
              alt={discipline.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-white mb-2 group-hover:translate-x-2 transition-transform">
                    {discipline.title}
                  </h3>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {discipline.description}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studio;