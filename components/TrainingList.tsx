import React, { useState } from 'react';
import { Training, TrainingType, User } from '../types';
import TrainingDetailModal from './TrainingDetailModal'; // Import the new modal component

interface TrainingListProps {
  trainings: Training[];
  user: User; // Renamed to currentUser within App.tsx, but kept here for now
  allUsers: User[]; 
  onRegister: (trainingId: string) => void;
  onUnregister: (trainingId: string) => void;
  onValidateTraining: (trainingId: string) => void; // New prop for validation
}

const TrainingList: React.FC<TrainingListProps> = ({ trainings, user, allUsers, onRegister, onUnregister, onValidateTraining }) => {
  const [filter, setFilter] = useState<TrainingType | 'ALL'>('ALL');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

  const filteredTrainings = trainings.filter(t => filter === 'ALL' || t.type === filter);

  // Filters Scroll View
  const filters = ['ALL', ...Object.values(TrainingType)];

  const openTrainingDetail = (training: Training) => {
    setSelectedTraining(training);
    setShowDetailModal(true);
  };

  const closeTrainingDetail = () => {
    setShowDetailModal(false);
    setSelectedTraining(null);
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Filter Scroll */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f 
                ? 'bg-fire-red text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {f === 'ALL' ? 'Tous' : f}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredTrainings.map(training => {
          const isRegistered = training.registeredUserIds.includes(user.id);
          const isFull = training.registeredUserIds.length >= training.slots;
          
          // Logic for card button: Can Register?
          let canRegisterForCard = true;
          let blockReasonForCard = '';

          // 1. Check FCES
          if (!user.fcesValid && training.type !== TrainingType.SUAP) {
            canRegisterForCard = false;
            blockReasonForCard = 'FCES invalide';
          }
          
          // 2. Check Prerequisites
          const missingPreqs = training.prerequisites.filter(p => !user.qualifications.includes(p));
          if (missingPreqs.length > 0) {
            canRegisterForCard = false;
            blockReasonForCard = `Manque: ${missingPreqs.join(', ')}`;
          }

          // 3. Check Slots
          if (isFull && !isRegistered) {
            canRegisterForCard = false;
            blockReasonForCard = 'Complet';
          }

          return (
            <div key={training.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="relative h-32 bg-slate-200">
                <img src={training.image || `https://picsum.photos/400/200?random=${training.id}`} alt={training.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">
                  {training.type}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 leading-tight">{training.title}</h3>
                </div>
                
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{training.description}</p>
                
                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>📅 {new Date(training.date).toLocaleDateString('fr-FR')}</span>
                    <span>👥 {training.registeredUserIds.length} / {training.slots}</span>
                  </div>

                  {isRegistered ? (
                    <button 
                      onClick={() => openTrainingDetail(training)} // Open modal to unregister
                      className="w-full py-2.5 rounded-lg border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                    >
                      Se désister
                    </button>
                  ) : (
                    <button 
                      onClick={() => openTrainingDetail(training)} // Open modal to register
                      disabled={!canRegisterForCard}
                      className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm ${
                        canRegisterForCard 
                          ? 'bg-fire-navy text-white hover:bg-slate-800 active:scale-[0.98] transform' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canRegisterForCard ? "S'inscrire" : `Indisponible (${blockReasonForCard})`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredTrainings.length === 0 && (
          <p className="text-center text-slate-400 py-10">Aucune formation trouvée.</p>
        )}
      </div>

      {/* Training Detail Modal */}
      {showDetailModal && selectedTraining && (
        <TrainingDetailModal
          training={selectedTraining}
          currentUser={user} // Pass currentUser
          allUsers={allUsers}
          onRegister={onRegister}
          onUnregister={onUnregister}
          onValidateTraining={onValidateTraining} // Pass new prop
          onClose={closeTrainingDetail}
        />
      )}
    </div>
  );
};

export default TrainingList;