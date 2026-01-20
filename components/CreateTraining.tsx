import React, { useState } from 'react';
import { TrainingType } from '../types';
import { generateTrainingDescription } from '../services/geminiService';

interface CreateTrainingProps {
  onCreate: (data: any) => void;
}

const CreateTraining: React.FC<CreateTrainingProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TrainingType>(TrainingType.INC);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState(6);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleAutoFill = async () => {
    if (!title) return;
    setGenerating(true);
    const desc = await generateTrainingDescription(title, type);
    setDescription(desc);
    setGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      title,
      type,
      date,
      slots,
      location,
      description,
      image: `https://picsum.photos/400/200?random=${Date.now()}`
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold mb-6 text-slate-900">Nouvelle Formation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-fire-red focus:outline-none"
            placeholder="Ex: Secours Routier - Niveau 1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select 
              value={type}
              onChange={e => setType(e.target.value as TrainingType)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-fire-red focus:outline-none"
            >
              {Object.values(TrainingType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Places</label>
            <input 
              type="number" 
              required
              min="1"
              value={slots}
              onChange={e => setSlots(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-fire-red focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input 
            type="date" 
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-fire-red focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Lieu</label>
          <input 
            type="text" 
            required
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-fire-red focus:outline-none"
            placeholder="Ex: Caserne Nord"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <button 
              type="button"
              onClick={handleAutoFill}
              disabled={!title || generating}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center gap-1"
            >
               {generating ? 'Génération...' : '✨ IA Auto-fill'}
            </button>
          </div>
          <textarea 
            required
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-fire-red focus:outline-none resize-none"
            placeholder="Description du stage..."
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full bg-fire-red text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 active:scale-[0.98] transition-transform mt-4"
        >
          Publier la Formation
        </button>

      </form>
    </div>
  );
};

export default CreateTraining;
