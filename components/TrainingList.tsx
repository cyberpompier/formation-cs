
import React, { useState, useMemo } from 'react';
import { Training, TrainingType, User } from '../types';
import TrainingDetailModal from './TrainingDetailModal';
import { isFcesValidForTraining } from '../utils/fces';

interface TrainingListProps {
  trainings: Training[];
  user: User;
  allUsers: User[]; 
  onRegister: (trainingId: string) => void;
  onUnregister: (trainingId: string) => void;
  onValidateTraining: (trainingId: string, presentUserIds: string[]) => void;
  onEditTraining: (training: Training) => void;
  onDeleteTraining: (trainingId: string) => void;
}

const TrainingList: React.FC<TrainingListProps> = ({ trainings, user, allUsers, onRegister, onUnregister, onValidateTraining, onEditTraining, onDeleteTraining }) => {
  const [filter, setFilter] = useState<TrainingType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null);

  const filteredTrainings = useMemo(() => {
    return trainings
      .filter(t => filter === 'ALL' || t.type === filter)
      .filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [trainings, filter, searchQuery]);

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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header avec Barre de Recherche */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-fire-red text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Rechercher un stage ou un lieu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-[2rem] text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-fire-red focus:ring-4 focus:ring-fire-red/5 transition-all shadow-sm"
          />
        </div>

        {/* Filtres de catégories */}
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-none">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-fire-red text-white shadow-xl shadow-red-200 -translate-y-0.5' 
                  : 'bg-white text-slate-500 border-2 border-slate-50 hover:border-fire-red/20 hover:bg-slate-50'
              }`}
            >
              {f === 'ALL' ? 'Tout voir' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des stages */}
      <div className="grid gap-6">
        {filteredTrainings.length > 0 ? (
          filteredTrainings.map(training => {
            const isRegistered = training.registeredUserIds.includes(user.id);
            const isFull = training.registeredUserIds.length >= training.slots;
            const fillPercentage = Math.min(100, (training.registeredUserIds.length / training.slots) * 100);
            
            // Calcul des pré-requis manquants
            const missingPrereqs = training.prerequisites.filter(p => !user.qualifications.includes(p));
            const hasPrereqs = missingPrereqs.length === 0;

            // Calcul dynamique de l'état FCES
            const isFcesValidForThisTraining = isFcesValidForTraining(user.fcesDate, training.date);

            let canRegister = true;
            let statusLabel = isRegistered ? "INSCRIT" : "DISPONIBLE";
            let statusColor = "text-emerald-500";

            if (!isFcesValidForThisTraining && training.type !== TrainingType.SUAP) {
              canRegister = false;
              statusLabel = "BLOQUÉ (FCES)";
              statusColor = "text-orange-500";
            } else if (!hasPrereqs && !isRegistered) {
              canRegister = false;
              statusLabel = "PRÉ-REQUIS MANQUANTS";
              statusColor = "text-amber-500";
            } else if (isFull && !isRegistered) {
              canRegister = false;
              statusLabel = "COMPLET";
              statusColor = "text-slate-400";
            }

            return (
              <div 
                key={training.id} 
                onClick={() => openTrainingDetail(training)}
                className={`bg-white rounded-[2.5rem] shadow-md border-2 overflow-hidden flex flex-col transition-all duration-300 active:scale-[0.98] cursor-pointer hover:shadow-2xl hover:border-fire-red/10 group relative ${
                  isRegistered ? 'border-fire-red/20 ring-4 ring-fire-red/5' : 'border-slate-50'
                }`}
              >
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img 
                    src={training.image || `https://picsum.photos/600/400?random=${training.id}`} 
                    alt={training.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Badges Premium */}
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                       <span className="bg-white/95 backdrop-blur shadow-lg text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-slate-100">
                        {training.type}
                      </span>
                      {isRegistered && (
                        <span className="bg-fire-red text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl shadow-red-500/30 animate-bounce">
                          ✓ Inscrit
                        </span>
                      )}
                    </div>
                    
                    {training.isCompleted && (
                      <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                        Terminé
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                       <span className="text-white text-[10px] font-black uppercase tracking-widest">
                         {new Date(training.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-black text-slate-900 text-2xl leading-none uppercase italic group-hover:text-fire-red transition-colors">
                      {training.title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sm shadow-sm">📍</div>
                      <span className="text-[11px] font-bold uppercase tracking-tight text-slate-500">{training.location}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                        <span className={statusColor}>{statusLabel}</span>
                        <span className="text-slate-400">{training.registeredUserIds.length} / {training.slots} AGENTS</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out rounded-full ${
                            isFull ? 'bg-slate-400' : isRegistered ? 'bg-fire-red' : 'bg-fire-red/60'
                          }`}
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div 
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-center transition-all duration-300 shadow-sm ${
                        isRegistered 
                          ? 'bg-slate-900 text-white hover:bg-black' 
                          : (!canRegister || training.isCompleted)
                            ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                            : 'bg-fire-red text-white hover:bg-red-700 shadow-fire-red/10'
                      }`}
                    >
                      {training.isCompleted ? "Stage archivé" : isRegistered ? "Gérer ma présence" : canRegister ? "Rejoindre le stage" : "Session restreinte"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="text-6xl grayscale opacity-50">🚒</div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Aucun stage trouvé</h3>
              <p className="text-slate-400 text-sm font-medium">Réessayez avec d'autres filtres ou une autre recherche.</p>
            </div>
            <button 
              onClick={() => { setFilter('ALL'); setSearchQuery(''); }}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Réinitialiser
            </button>
          </div>
        )}
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
          onEditTraining={onEditTraining}
          onDeleteTraining={onDeleteTraining}
          onClose={closeTrainingDetail}
        />
      )}
    </div>
  );
};

export default TrainingList;

