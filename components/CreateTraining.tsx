
import React, { useState, useEffect } from 'react';
import { ALL_QUALIFICATIONS, TrainingType } from '../types';
import { generateTrainingDescription } from '../services/geminiService';

interface CreateTrainingProps {
  onCreate: (data: any) => void;
}

const CreateTraining: React.FC<CreateTrainingProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TrainingType>(TrainingType.INC);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState(''); 
  const [durationDays, setDurationDays] = useState(1);
  const [hoursPerDay, setHoursPerDay] = useState(7); // New state for hours per day
  const [slots, setSlots] = useState(6);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); 
  const [trainer1, setTrainer1] = useState(''); 
  const [trainer2, setTrainer2] = useState(''); 
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<string[]>([]); 

  const [generating, setGenerating] = useState(false);
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    // Check API key status on mount
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
        setShowApiKeyPrompt(!hasKey);
      } else {
        setApiKeySelected(true); 
      }
    };
    checkApiKey();
  }, []);

  const handleAutoFill = async () => {
    if (!title) {
      setAiError("Veuillez entrer un titre pour la formation avant d'utiliser l'IA.");
      return;
    }

    if (!window.aistudio) {
      setGenerating(true);
      const desc = await generateTrainingDescription(title, type);
      setDescription(desc);
      setGenerating(false);
      return;
    }

    if (!apiKeySelected) {
      setShowApiKeyPrompt(true);
      return;
    }

    setGenerating(true);
    setAiError(null);
    try {
      const desc = await generateTrainingDescription(title, type);
      setDescription(desc);
    } catch (error: any) {
      if (error.message === "API_KEY_ERROR") {
        setApiKeySelected(false);
        setShowApiKeyPrompt(true);
        setAiError("Veuillez configurer votre clé API pour générer la description.");
      } else {
        setAiError("Erreur lors de la génération de la description. Réessayez.");
      }
      console.error("Failed to generate description:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success and retry immediately
      setApiKeySelected(true);
      setShowApiKeyPrompt(false);
      setAiError(null); // Clear previous error
      // Immediately try to auto-fill again, as per guideline for race condition
      setGenerating(true);
      try {
        const desc = await generateTrainingDescription(title, type);
        setDescription(desc);
      } catch (error: any) {
        if (error.message === "API_KEY_ERROR") {
          setAiError("Clé API invalide ou problème de facturation. Veuillez vérifier votre clé.");
        } else {
          setAiError("Erreur inattendue après la sélection de la clé API.");
        }
        setApiKeySelected(false); // Indicate failure to user
        setShowApiKeyPrompt(true);
        console.error("Failed to generate description after key selection:", error);
      } finally {
        setGenerating(false);
      }
    } else {
      setAiError("L'outil de sélection de clé API n'est pas disponible dans cet environnement.");
    }
  };

  const handleTogglePrerequisite = (qual: string) => {
    setSelectedPrerequisites(prev =>
      prev.includes(qual) ? prev.filter(q => q !== qual) : [...prev, qual]
    );
  };

  const handleGenerateRandomImage = () => {
    setImage(`https://picsum.photos/400/200?random=${Date.now()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      title,
      type,
      date,
      startTime, 
      durationDays, 
      hoursPerDay, // Include hours per day
      slots,
      location,
      description,
      image: image || `https://picsum.photos/400/200?random=${Date.now()}`, 
      trainer1, 
      trainer2, 
      prerequisites: selectedPrerequisites 
    });
    // Reset form fields
    setTitle('');
    setType(TrainingType.INC);
    setDate('');
    setStartTime('');
    setDurationDays(1);
    setHoursPerDay(7);
    setSlots(6);
    setLocation('');
    setDescription('');
    setImage('');
    setTrainer1('');
    setTrainer2('');
    setSelectedPrerequisites([]);
  };

  // Common input styling for consistency
  const inputStyle = "w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-fire-red focus:outline-none bg-white text-slate-900 placeholder-slate-400";

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
            className={inputStyle}
            placeholder="Ex: Secours Routier - Niveau 1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select 
              value={type}
              onChange={e => setType(e.target.value as TrainingType)}
              className={inputStyle}
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
              className={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Heure de Début</label>
            <input 
              type="time" 
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Durée (Jours)</label>
            <input 
              type="number" 
              required
              min="1"
              value={durationDays}
              onChange={e => setDurationDays(parseInt(e.target.value))}
              className={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Heures / Jour</label>
            <input 
              type="number" 
              required
              min="1"
              max="24"
              value={hoursPerDay}
              onChange={e => setHoursPerDay(parseInt(e.target.value))}
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Lieu</label>
          <input 
            type="text" 
            required
            value={location}
            onChange={e => setLocation(e.target.value)}
            className={inputStyle}
            placeholder="Ex: Caserne Nord"
          />
        </div>

        {/* Pré-requis Tags */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Pré-requis</label>
          <div className="flex flex-wrap gap-2">
            {ALL_QUALIFICATIONS.map(qual => (
              <button
                key={qual}
                type="button"
                onClick={() => handleTogglePrerequisite(qual)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedPrerequisites.includes(qual)
                    ? 'bg-fire-red text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {qual}
              </button>
            ))}
          </div>
        </div>

        {/* Trainers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Formateur 1</label>
            <input 
              type="text" 
              value={trainer1}
              onChange={e => setTrainer1(e.target.value)}
              className={inputStyle}
              placeholder="Ex: Cdt. Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Formateur 2 (optionnel)</label>
            <input 
              type="text" 
              value={trainer2}
              onChange={e => setTrainer2(e.target.value)}
              className={inputStyle}
              placeholder="Ex: Sgt. Johnson"
            />
          </div>
        </div>


        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <button 
              type="button"
              onClick={handleAutoFill}
              disabled={!title || generating || showApiKeyPrompt}
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
            className={`${inputStyle} resize-none`}
            placeholder="Description du stage..."
          ></textarea>
          {aiError && <p className="text-red-600 text-xs mt-1">{aiError}</p>}
        </div>

        {/* Image Bandeau */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Image de la Formation (URL)</label>
            <button 
              type="button"
              onClick={handleGenerateRandomImage}
              className="text-xs font-bold text-slate-600 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
            >
               📷 Générer Aléatoire
            </button>
          </div>
          <input 
            type="url" 
            value={image}
            onChange={e => setImage(e.target.value)}
            className={inputStyle}
            placeholder="https://picsum.photos/400/200?random=..."
          />
          {image && <img src={image} alt="Prévisualisation" className="mt-2 w-full h-32 object-cover rounded-lg border border-slate-200" />}
        </div>


        {showApiKeyPrompt && (
          <div className="bg-red-50 p-4 rounded-xl text-sm leading-relaxed text-center text-red-700">
            <p className="mb-3">Pour utiliser l'IA, veuillez configurer votre clé API.</p>
            <button 
              type="button"
              onClick={handleOpenSelectKey}
              className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Sélectionner clé API
            </button>
            <p className="mt-2 text-xs text-slate-600">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-900">
                Information sur la facturation
              </a>
            </p>
          </div>
        )}

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
