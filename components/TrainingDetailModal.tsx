import React, { useState } from 'react';
import { Training, User, Rank } from '../types';

interface TrainingDetailModalProps {
  training: Training;
  currentUser: User; // Changed from 'user' to 'currentUser' for clarity
  allUsers: User[];
  onRegister: (trainingId: string) => void;
  onUnregister: (trainingId: string) => void;
  onValidateTraining: (trainingId: string) => void; // New prop for validation
  onClose: () => void;
}

const TrainingDetailModal: React.FC<TrainingDetailModalProps> = ({
  training,
  currentUser, // Use currentUser here
  allUsers,
  onRegister,
  onUnregister,
  onValidateTraining, // Destructure new prop
  onClose,
}) => {
  const [showConfirmValidation, setShowConfirmValidation] = useState(false);
  const [showConfirmUnregister, setShowConfirmUnregister] = useState(false); // New state for unregister confirmation

  const isRegistered = training.registeredUserIds.includes(currentUser.id);
  const isFull = training.registeredUserIds.length >= training.slots;
  const isTrainingCompleted = training.isCompleted; // Check if training is completed

  let canRegister = true;
  let blockReason = '';

  // 1. Check FCES
  if (!currentUser.fcesValid && training.type !== 'Secourisme') {
    canRegister = false;
    blockReason = 'FCES invalide';
  }

  // 2. Check Prerequisites
  const missingPreqs = training.prerequisites.filter(p => !currentUser.qualifications.includes(p));
  if (missingPreqs.length > 0) {
    canRegister = false;
    blockReason = `Manque: ${missingPreqs.join(', ')}`;
  }

  // 3. Check Slots
  if (isFull && !isRegistered) { // Only block if full AND currentUser is not already registered
    canRegister = false;
    blockReason = 'Complet';
  }

  // Find registered users' details
  const registeredParticipants = training.registeredUserIds
    .map(id => allUsers.find(u => u.id === id))
    .filter((u): u is User => u !== undefined);

  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(training.location)}`;

  const renderRankIcon = (rank: Rank) => {
    switch(rank) {
      case Rank.SAP:
      case Rank.S1C: return '🧑‍🚒';
      case Rank.CPL:
      case Rank.CCH: return '🎖️';
      case Rank.SGT:
      case Rank.SCH: return '🏅';
      case Rank.ADJ:
      case Rank.ADC: return '🏆';
      case Rank.LTN:
      case Rank.CPT: return '👨‍✈️';
      case Rank.CDT:
      case Rank.LCL:
      case Rank.COL:
      case Rank.CGL: return '🌟';
      default: return '👤';
    }
  };

  const handleValidateClick = () => {
    setShowConfirmValidation(true);
  };

  const handleConfirmValidation = () => {
    onValidateTraining(training.id);
    setShowConfirmValidation(false);
    onClose(); // Close the main modal after validation
  };

  const handleUnregisterClick = () => {
    setShowConfirmUnregister(true);
  };

  const handleConfirmUnregister = () => {
    onUnregister(training.id);
    setShowConfirmUnregister(false);
    onClose(); // Close the main modal after unregistration
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-in fade-in duration-300">
      {/* Main Modal Container */}
      <div className="bg-white rounded-none shadow-xl w-full h-full relative animate-in zoom-in-95 ease-out duration-300 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 text-2xl z-10 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm"
          aria-label="Fermer"
        >
          &times;
        </button>

        {/* Image Section */}
        <div className="relative h-48 bg-slate-200 overflow-hidden rounded-t-none">
          <img src={training.image || `https://picsum.photos/400/200?random=${training.id}`} alt={training.title} className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-semibold">
            {training.type}
          </div>
          {isTrainingCompleted && (
            <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
              ✅ Validée
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{training.title}</h2>
          <p className="text-sm text-slate-600 mb-4">{training.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-slate-700 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span>{new Date(training.date).toLocaleDateString('fr-FR')}</span>
            </div>
            {training.startTime && (
              <div className="flex items-center gap-2">
                <span className="text-lg">⏰</span>
                <span>{training.startTime}</span>
              </div>
            )}
            {training.durationDays && training.durationDays > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-lg">🗓️</span>
                <span>{training.durationDays} jour{training.durationDays > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-2 col-span-2">
              <span className="text-lg">📍</span>
              <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-fire-red hover:underline flex items-center gap-1">
                {training.location} <span className="text-xs">↗️</span>
              </a>
            </div>
            {training.trainer1 && (
              <div className="flex items-center gap-2">
                <span className="text-lg">👨‍🏫</span>
                <span>{training.trainer1}</span>
              </div>
            )}
            {training.trainer2 && (
              <div className="flex items-center gap-2">
                <span className="text-lg">👩‍🏫</span>
                <span>{training.trainer2}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <span>{training.registeredUserIds.length} / {training.slots} places</span>
            </div>
          </div>

          {/* Prerequisites */}
          {training.prerequisites.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Pré-requis:</h3>
              <div className="flex flex-wrap gap-2">
                {training.prerequisites.map(prereq => (
                  <span
                    key={prereq}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      currentUser.qualifications.includes(prereq)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Participants List */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Participants ({registeredParticipants.length}):</h3>
            {registeredParticipants.length > 0 ? (
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {registeredParticipants.map(participant => (
                  <div key={participant.id} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-lg">{renderRankIcon(participant.rank)}</span>
                    <span>{participant.rank} {participant.firstName} {participant.lastName}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Aucun participant inscrit pour le moment.</p>
            )}
          </div>
        </div>

        {/* Action Button Area - Sticky Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-col gap-3"> {/* Use flex column to stack buttons */}
            {(currentUser.isAdmin || currentUser.isTrainer) && !isTrainingCompleted && (
              <button
                onClick={handleValidateClick}
                className="w-full py-3 rounded-xl font-semibold text-base transition-colors shadow-lg bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] transform"
              >
                Valider la formation
              </button>
            )}

            {isRegistered ? (
              <button
                onClick={handleUnregisterClick} // Open confirmation modal first
                className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-base hover:bg-slate-50 transition-colors shadow-sm active:scale-[0.98]"
              >
                Se désister
              </button>
            ) : (
              <button
                onClick={() => { onRegister(training.id); onClose(); }}
                disabled={!canRegister}
                className={`w-full py-3 rounded-xl font-semibold text-base transition-colors shadow-lg ${
                  canRegister
                    ? 'bg-fire-red text-white hover:bg-red-700 active:scale-[0.98] transform'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {canRegister ? "S'inscrire" : `Indisponible (${blockReason})`}
              </button>
            )}
          </div>
            {!canRegister && !isRegistered && (
              <p className="text-red-600 text-xs mt-3 text-center">
                {blockReason === 'FCES invalide' && '⚠️ Votre FCES est expirée. Mettez-le à jour pour vous inscrire.'}
                {blockReason.startsWith('Manque:') && `⚠️ Il vous manque des pré-requis: ${blockReason.substring(7)}.`}
                {blockReason === 'Complet' && '⚠️ Cette formation est complète.'}
              </p>
            )}
          </div>
      </div>

      {/* Confirmation Modal for Validation */}
      {showConfirmValidation && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-in zoom-in-95 ease-out duration-200">
            <p className="text-lg font-bold text-slate-800 mb-4">Confirmer la validation</p>
            <p className="text-sm text-slate-600 mb-6">Êtes-vous sûr de vouloir valider cette formation ? Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmValidation(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmValidation}
                className="flex-1 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Oui, valider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Unregister */}
      {showConfirmUnregister && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-in zoom-in-95 ease-out duration-200">
            <p className="text-lg font-bold text-slate-800 mb-4">Confirmer le désistement</p>
            <p className="text-sm text-slate-600 mb-6">Êtes-vous sûr de vouloir vous désister de cette formation ?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmUnregister(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmUnregister}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Oui, me désister
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDetailModal;