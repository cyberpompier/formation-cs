import React, { useState } from 'react';
import { Training, User, Rank } from '../types';

interface TrainingDetailModalProps {
  training: Training;
  currentUser: User;
  allUsers: User[];
  onRegister: (trainingId: string) => void;
  onUnregister: (trainingId: string) => void;
  onValidateTraining: (trainingId: string) => void;
  onClose: () => void;
}

const TrainingDetailModal: React.FC<TrainingDetailModalProps> = ({
  training,
  currentUser,
  allUsers,
  onRegister,
  onUnregister,
  onValidateTraining,
  onClose,
}) => {
  const [showConfirmUnregister, setShowConfirmUnregister] = useState(false);

  const isRegistered = training.registeredUserIds.includes(currentUser.id);
  const isFull = training.registeredUserIds.length >= training.slots;
  const isTrainingCompleted = training.isCompleted;

  let canRegister = true;
  let blockReason = '';

  if (!currentUser.fcesValid && training.type !== 'Secourisme') {
    canRegister = false;
    blockReason = 'FCES expirée';
  }

  const missingPreqs = training.prerequisites.filter(p => !currentUser.qualifications.includes(p));
  if (missingPreqs.length > 0) {
    canRegister = false;
    blockReason = 'Pré-requis manquants';
  }

  if (isFull && !isRegistered) {
    canRegister = false;
    blockReason = 'Stage complet';
  }

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
      default: return '👤';
    }
  };

  return (
    /* Passage à z-[60] pour recouvrir la barre de navigation z-50 */
    <div className="fixed inset-0 bg-slate-900/98 backdrop-blur-lg z-[60] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white rounded-none w-full h-full relative animate-in slide-in-from-bottom duration-500 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Bouton de Fermeture flottant - z-index 70 pour rester au-dessus de tout */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 text-4xl z-[70] w-14 h-14 flex items-center justify-center bg-white/90 rounded-full shadow-2xl transition-all active:scale-75 border border-slate-100"
        >
          &times;
        </button>

        {/* 1. Hero Section (Fixe en haut) */}
        <div className="relative h-60 bg-slate-200 shrink-0">
          <img 
            src={training.image || `https://picsum.photos/400/200?random=${training.id}`} 
            alt={training.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-fire-red text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl mb-3 inline-block">
              {training.type}
            </span>
            <h2 className="text-2xl font-black text-white leading-none uppercase italic tracking-tighter">{training.title}</h2>
          </div>
        </div>

        {/* 2. Contenu de la formation (Déroulable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
          
          {/* Dashboard d'informations */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Date</p>
              <p className="font-black text-slate-900 text-base uppercase italic">{new Date(training.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Places</p>
              <p className="font-black text-slate-900 text-base uppercase italic">{training.slots - training.registeredUserIds.length} libres</p>
            </div>
            <div className="col-span-2 bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Lieu de rendez-vous</p>
                <p className="font-black text-slate-900 uppercase italic truncate max-w-[200px]">{training.location}</p>
              </div>
              <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-xl shadow-md border border-slate-200 text-fire-red active:scale-90 transition-transform">
                📍
              </a>
            </div>
          </div>

          {/* Description pédagogique */}
          <section>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3 border-l-4 border-fire-red pl-3">
              Programme du stage
            </h3>
            <p className="text-slate-600 leading-relaxed font-bold text-sm">
              {training.description}
            </p>
          </section>

          {/* Liste des participants */}
          <section>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 border-l-4 border-fire-red pl-3">
              Agents déjà engagés ({registeredParticipants.length})
            </h3>
            <div className="space-y-3 mb-8">
              {registeredParticipants.length > 0 ? (
                registeredParticipants.map(participant => (
                  <div key={participant.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem]">
                    <span className="text-2xl shrink-0">{renderRankIcon(participant.rank)}</span>
                    <div className="flex-1">
                      <p className="font-black text-slate-900 leading-none mb-1 uppercase italic">
                        {participant.rank} {participant.lastName}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{participant.center}</p>
                    </div>
                    {participant.id === currentUser.id && (
                      <span className="bg-fire-red text-white text-[8px] font-black px-3 py-1 rounded-full uppercase shadow-lg">Moi</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-300 font-black italic text-[10px] uppercase tracking-widest">En attente d'inscriptions</p>
                </div>
              )}
            </div>
          </section>

          {/* ACTIONS : Placées sous la liste des participants */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {isTrainingCompleted ? (
              <div className="w-full py-5 rounded-[1.5rem] bg-green-50 border-2 border-green-100 text-green-700 font-black text-[12px] uppercase tracking-widest text-center italic">
                ✓ Session validée
              </div>
            ) : isRegistered ? (
              <button
                onClick={() => setShowConfirmUnregister(true)}
                className="w-full py-6 rounded-[1.5rem] bg-slate-900 text-white font-black text-[12px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Se désister de ce stage
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => { onRegister(training.id); }}
                  disabled={!canRegister}
                  className={`w-full py-6 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${
                    canRegister 
                      ? 'bg-fire-red text-white shadow-red-200' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300 shadow-none'
                  }`}
                >
                  {canRegister ? "Confirmer mon inscription" : `Inscription bloquée`}
                </button>
                {!canRegister && (
                  <p className="text-center text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 py-3 rounded-2xl border border-red-100">
                    ⚠️ {blockReason}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Désistement (Overlay supérieur) */}
      {showConfirmUnregister && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-8 animate-in zoom-in duration-200">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-sm text-center shadow-2xl border border-slate-100">
            <div className="text-6xl mb-8">🚪</div>
            <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase italic leading-none">Annuler ?</h4>
            <p className="text-sm text-slate-500 font-bold mb-10 leading-relaxed uppercase tracking-widest">
              Voulez-vous libérer votre place pour un autre agent ?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowConfirmUnregister(false)} className="py-5 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Retour</button>
              <button 
                onClick={() => { onUnregister(training.id); setShowConfirmUnregister(false); }} 
                className="py-5 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95 transition-all"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDetailModal;