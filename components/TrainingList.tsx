import React, { useState } from 'react';
import { Training, TrainingType, User } from '../types';
import TrainingDetailModal from './TrainingDetailModal';

interface TrainingListProps {
  trainings: Training[];
  user: User;
  allUsers: User[]; 
  onRegister: (trainingId: string) => void;
  onUnregister: (trainingId: string) => void;
  onValidateTraining: (trainingId: string) => void;
}

const TrainingList: React.FC<TrainingListProps> = ({ trainings, user, allUsers, onRegister, onUnregister, onValidateTraining }) => {
  const [filter, setFilter] = useState<TrainingType | 'ALL'>('ALL');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null);

  const filteredTrainings = trainings.filter(t => filter === 'ALL' || t.type === filter);
  const filters = ['ALL', ...Object.values(TrainingType)];

  const openTrainingDetail = (training: Training) => {
    setSelectedTrainingId(training.id);
    setShowDetailModal(true);
  };

  const closeTrainingDetail = () => {
    setShowDetailModal(false);
    setSelectedTrainingId(null);
  };

  const currentSelectedTraining = trainings.find(t => t.id === selectedTrainingId);

  return (
    <div className="space-y-6">
      {/* Filtres de catégories */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-fire-red text-white shadow-lg shadow-red-200 scale-105' 
                : 'bg-white text-slate-400 border border-slate-200'
            }`}
          >
            {f === 'ALL' ? 'Tous les stages' : f}
          </button>
        ))}
      </div>

      {/* Liste des stages */}
      <div className="grid gap-6">
        {filteredTrainings.map(training => {
          const isRegistered = training.registeredUserIds.includes(user.id);
          const isFull = training.registeredUserIds.length >= training.slots;
          
          let canRegister = true;
          let statusLabel = isRegistered ? "INSCRIT" : "DISPONIBLE";

          if (!user.fcesValid && training.type !== TrainingType.SUAP) {
            canRegister = false;
            statusLabel = "BLOQUÉ (FCES)";
          } else if (isFull && !isRegistered) {
            canRegister = false;
            statusLabel = "COMPLET";
          }

          return (
            <div 
              key={training.id} 
              onClick={() => openTrainingDetail(training)}
              className={`bg-white rounded-[2.5rem] shadow-sm border overflow-hidden flex flex-col transition-all active:scale-[0.98] cursor-pointer hover:shadow-xl group ${
                isRegistered ? 'border-slate-900 border-2' : 'border-slate-100'
              }`}
            >
              <div className="relative h-44 bg-slate-200 overflow-hidden">
                <img 
                  src={training.image || `https://picsum.photos/400/200?random=${training.id}`} 
                  alt={training.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
                />
                
                {/* Badges sur l'image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-black/70 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
                    {training.type}
                  </div>
                  {isRegistered && (
                    <div className="bg-fire-red text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase shadow-xl animate-pulse">
                      ✓ Vous êtes inscrit
                    </div>
                  )}
                </div>

                {training.isCompleted && (
                  <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-green-600 text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-2xl uppercase tracking-widest">
                      Session terminée
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-black text-slate-900 text-xl leading-none mb-3 uppercase italic">
                  {training.title}
                </h3>
                
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 mb-6 uppercase tracking-tight">
                  <span className="flex items-center gap-1">📅 {new Date(training.date).toLocaleDateString('fr-FR')}</span>
                  <span className="flex items-center gap-1">👥 {training.registeredUserIds.length}/{training.slots} AGENTS</span>
                </div>
                
                <div className="mt-auto">
                  <div 
                    className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] text-center transition-all ${
                      isRegistered 
                        ? 'bg-slate-900 text-white' 
                        : (!canRegister || training.isCompleted)
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-fire-red text-white shadow-lg shadow-red-100'
                    }`}
                  >
                    {training.isCompleted ? "STAGE CLÔTURÉ" : isRegistered ? "VOIR MON INSCRIPTION" : canRegister ? "S'INSCRIRE AU STAGE" : statusLabel}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modale réactive */}
      {showDetailModal && currentSelectedTraining && (
        <TrainingDetailModal
          key={`${selectedTrainingId}-${currentSelectedTraining.registeredUserIds.length}`}
          training={currentSelectedTraining}
          currentUser={user}
          allUsers={allUsers}
          onRegister={onRegister}
          onUnregister={onUnregister}
          onValidateTraining={onValidateTraining}
          onClose={closeTrainingDetail}
        />
      )}
    </div>
  );
};

export default TrainingList;