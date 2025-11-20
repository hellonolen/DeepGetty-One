import React, { useState } from 'react';
import { PenTool, Save } from 'lucide-react';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState([
    { id: 1, date: 'Oct 24', title: 'Kinetic Flow Mastery', preview: 'Felt a deeper connection in the third area today...' }
  ]);
  const [isWriting, setIsWriting] = useState(false);

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-white">Journal</h1>
        <button 
          onClick={() => setIsWriting(!isWriting)}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors font-medium"
        >
          <PenTool className="w-4 h-4" />
          {isWriting ? 'Cancel' : 'New Entry'}
        </button>
      </div>

      {isWriting && (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-8 animate-in slide-in-from-top-4">
          <input 
            type="text" 
            placeholder="Entry Title..." 
            className="w-full bg-transparent text-2xl font-bold text-white border-b border-zinc-800 pb-2 mb-4 focus:outline-none focus:border-blue-500"
          />
          <textarea 
            className="w-full bg-transparent text-gray-300 h-40 resize-none focus:outline-none"
            placeholder="Reflect on your discipline today..."
          ></textarea>
          <div className="flex justify-end mt-4">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm">
              <Save className="w-4 h-4" /> Save Entry
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{entry.title}</h3>
              <span className="text-xs text-gray-500 font-mono">{entry.date}</span>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">{entry.preview}</p>
          </div>
        ))}
        <div className="p-6 text-center text-gray-600 text-sm italic">
          "Discipline is doing what needs to be done, even if you don't want to do it."
        </div>
      </div>
    </div>
  );
};

export default Journal;
