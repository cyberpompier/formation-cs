
import React, { useState } from 'react';
import { Training, User, Rank, ALL_QUALIFICATIONS, TrainingType } from '../types';
import { isFcesValidForTraining } from '../utils/fces';

interface TrainingDetailModalProps {
  training: Training;
  currentUser: User;
  allUsers: User[];
  onRegister: (trainingId: string) => void;
  onUnregister: (trainingId: string) => void;
  onValidateTraining: (trainingId: string, presentUserIds: string[]) => void;
  onEditTraining: (training: Training) => void;
  onDeleteTraining: (trainingId: string) => void;
  onClose: () => void;
}

const TrainingDetailModal: React.FC<TrainingDetailModalProps> = ({
  training,
  currentUser,
  allUsers,
  onRegister,
  onUnregister,
  onValidateTraining,
  onEditTraining,
  onDeleteTraining,
  onClose,
}) => {
  const [showConfirmRegister, setShowConfirmRegister] = useState(false);
  const [showConfirmUnregister, setShowConfirmUnregister] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmValidate, setShowConfirmValidate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Training>(training);

  const [attendance, setAttendance] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    training.registeredUserIds.forEach(id => {
      initialState[id] = true;
    });
    return initialState;
  });

  const isRegistered = training.registeredUserIds.includes(currentUser.id);
  const isFull = training.registeredUserIds.length >= training.slots;
  const isTrainingCompleted = training.isCompleted;
  
  const canEdit = currentUser.isTrainer || currentUser.isAdmin;
  const canValidate = currentUser.isAdmin;

  let canRegister = true;
  let blockReason = '';

  const isFcesValidForThisTraining = isFcesValidForTraining(currentUser.fcesDate, training.date);

  if (!isFcesValidForThisTraining && training.type !== TrainingType.SUAP) {
    canRegister = false;
    blockReason = 'FCES non valide à la date du stage';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'slots' || name === 'durationDays' || name === 'hoursPerDay') ? parseInt(value) : value
    }));
  };

  const handleTogglePrerequisite = (qual: string) => {
    setFormData(prev => {
      const exists = prev.prerequisites.includes(qual);
      if (exists) {
        return { ...prev, prerequisites: prev.prerequisites.filter(q => q !== qual) };
      } else {
        return { ...prev, prerequisites: [...prev.prerequisites, qual] };
      }
    });
  };

  const handleSave = () => {
    onEditTraining(formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteTraining(training.id);
    onClose();
  };

  const handleToggleAttendance = (userId: string) => {
    setAttendance(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleValidate = () => {
    const presentUserIds = Object.keys(attendance).filter(id => attendance[id]);
    onValidateTraining(training.id, presentUserIds);
    setShowConfirmValidate(false);
  };

  const handleCancelEdit = () => {
    setFormData(training);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[60] flex items-center justify-center p-0 md:p-4 animate-fade-in">
      <div className="bg-white w-full h-full md:h-[95vh] md:max-w-xl md:rounded-[3rem] relative shadow-2xl overflow-hidden flex flex-col animate-slide-in-bottom">
        
        {/* Top Control Bar (Sticky) */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[75] pointer-events-none">
          <div className="pointer-events-auto">
            {!isEditing && canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full shadow-2xl transition-all active:scale-75 border border-white/20 text-white hover:bg-white hover:text-fire-red"
              >
                ✏️
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 pointer-events-auto flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full shadow-2xl transition-all active:scale-75 border border-white/20 text-white text-2xl hover:bg-white hover:text-slate-900"
          >
            &times;
          </button>
        </div>

        {/* 1. Hero Section (Visual Background) */}
        <div className="relative h-80 bg-slate-900 shrink-0">
          <img 
            src={formData.image || `https://picsum.photos/600/400?random=${training.id}`} 
            alt={training.title} 
            className="w-full h-full object-cover opacity-60 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
          
          <div className="absolute bottom-10 left-8 right-8 space-y-3">
            {isEditing ? (
              <div className="flex flex-col gap-3">
                 <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-fit bg-fire-red text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl outline-none border-2 border-white/20"
                 >
                   {Object.values(TrainingType).map(t => (
                     <option key={t} value={t} className="text-slate-900">{t}</option>
                   ))}
                 </select>
                 <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 backdrop-blur-md border-b-2 border-white/50 focus:border-fire-red text-3xl font-black text-white uppercase italic tracking-tighter outline-none p-2 rounded-lg"
                  />
              </div>
            ) : (
              <>
                <span className="bg-fire-red text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl inline-block">
                  {training.type}
                </span>
                <h2 className="text-4xl font-black text-slate-900 leading-[0.9] uppercase italic tracking-tighter drop-shadow-sm">
                  {training.title}
                </h2>
              </>
            )}
          </div>
          
          {isEditing && (
             <div className="absolute top-20 left-8 right-8">
                <input 
                  type="text" 
                  name="image" 
                  value={formData.image || ''} 
                  onChange={handleInputChange}
                  placeholder="URL de l'image de fond" 
                  className="w-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold p-3 rounded-xl border border-white/20 placeholder:text-white/40"
                />
             </div>
          )}
        </div>

        {/* 2. Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-none pb-40">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 flex flex-col justify-center transition-all hover:bg-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Date & Heure</p>
              {isEditing ? (
                <div className="space-y-2">
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-white p-2 rounded-xl text-xs font-bold border" />
                  <input type="time" name="startTime" value={formData.startTime || ''} onChange={handleInputChange} className="w-full bg-white p-2 rounded-xl text-xs font-bold border" />
                </div>
              ) : (
                <p className="font-black text-slate-900 text-lg uppercase italic leading-none">
                  {new Date(formData.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} <span className="text-fire-red">•</span> {formData.startTime || '08:00'}
                </p>
              )}
            </div>

            <div className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 flex flex-col justify-center transition-all hover:bg-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Disponibilité</p>
              {isEditing ? (
                 <input type="number" name="slots" value={formData.slots} onChange={handleInputChange} className="w-full bg-white p-2 rounded-xl text-xs font-bold border" />
              ) : (
                <p className="font-black text-slate-900 text-lg uppercase italic leading-none">
                  {training.slots - training.registeredUserIds.length} <span className="text-slate-300 font-medium">/ {training.slots}</span>
                </p>
              )}
            </div>
          </div>

          {/* Location Bar */}
          <div className="flex items-center gap-4 bg-slate-900 p-2 pl-6 rounded-[2rem] shadow-xl group transition-all hover:bg-black">
             <div className="flex-1 overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Localisation</p>
                {isEditing ? (
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-transparent text-white text-sm font-bold outline-none border-b border-white/20 pb-1" />
                ) : (
                  <p className="font-bold text-white text-sm uppercase italic truncate">{formData.location}</p>
                )}
             </div>
             {!isEditing && (
               <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-lg transition-transform active:scale-90 group-hover:rotate-12">
                 📍
               </a>
             )}
          </div>

          {/* Pedagogical Content */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-8 h-[2px] bg-fire-red"></span>
              Objectifs Pédagogiques
            </h3>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full bg-slate-50 p-6 rounded-[2rem] font-medium text-sm text-slate-900 leading-relaxed outline-none border-2 border-slate-100 focus:border-fire-red resize-none"
              />
            ) : (
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                <p className="text-slate-600 leading-relaxed font-medium text-base relative z-10 whitespace-pre-wrap">
                  {formData.description}
                </p>
              </div>
            )}
          </section>

          {/* Participants */}
          {!isEditing && (
            <section className="space-y-6">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  Agents Inscrits
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
                  {registeredParticipants.length} / {training.slots}
                </span>
              </div>
              <div className="grid gap-3">
                {registeredParticipants.length > 0 ? (
                  registeredParticipants.map(participant => (
                    <div key={participant.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:border-slate-200 transition-all hover:translate-x-1">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner ring-1 ring-slate-100 italic">
                        {renderRankIcon(participant.rank)}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 text-sm uppercase italic tracking-tight">
                          {participant.rank} {participant.lastName}
                        </p>
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{participant.firstName}</p>
                      </div>
                      {participant.id === currentUser.id && (
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 text-[8px] font-black px-3 py-1.5 rounded-full uppercase border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Moi
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50/30">
                    <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.3em]">Session vide</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Formateurs / Prerequisites section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encadrement</p>
                <div className="bg-slate-50 p-5 rounded-3xl space-y-1 border border-slate-100">
                   <p className="text-sm font-black text-slate-900 truncate uppercase italic">{formData.trainer1 || 'À confirmer'}</p>
                   {formData.trainer2 && <p className="text-[10px] font-bold text-slate-400 uppercase">{formData.trainer2}</p>}
                </div>
             </section>
             
             {formData.prerequisites.length > 0 && (
               <section className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pré-requis</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.prerequisites.map(p => (
                      <span key={p} className="bg-slate-900 text-white text-[9px] font-black px-4 py-2 rounded-xl shadow-sm uppercase tracking-wide">
                        {p}
                      </span>
                    ))}
                  </div>
               </section>
             )}
          </div>
        </div>

        {/* 3. Bottom Action Bar (Fixed) */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 pb-12 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-[80]">
          <div className="container mx-auto max-w-lg pointer-events-auto">
            {isEditing ? (
              <div className="flex gap-4">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 py-5 rounded-[2rem] bg-slate-100 text-slate-900 font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-slate-100/50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex-[2] py-5 rounded-[2rem] bg-fire-red text-white font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-red-500/20"
                >
                  Sauvegarder
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {canValidate && !isTrainingCompleted && (
                   <button
                     onClick={() => setShowConfirmValidate(true)}
                     className="w-full py-4 rounded-[2rem] bg-emerald-500 text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     ✅ Clôturer la session
                   </button>
                )}

                {isTrainingCompleted ? (
                   <div className="w-full py-6 rounded-[2.5rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] text-center italic shadow-2xl transition-all">
                     Session terminée
                   </div>
                ) : isRegistered ? (
                  <button
                    onClick={() => setShowConfirmUnregister(true)}
                    className="w-full py-6 rounded-[2.5rem] bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all hover:bg-black"
                  >
                    Se désister
                  </button>
                ) : (
                  <div className="space-y-3">
                    {!canRegister && blockReason && (
                       <div className="text-center p-3 rounded-2xl bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-100 flex items-center justify-center gap-2 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        {blockReason}
                       </div>
                    )}
                    <button
                      onClick={() => setShowConfirmRegister(true)}
                      disabled={!canRegister}
                      className={`w-full py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 ${
                        canRegister 
                          ? 'bg-fire-red text-white shadow-red-500/30 hover:bg-red-700' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-100'
                      }`}
                    >
                      {canRegister ? "M'inscrire au stage" : "Session restreinte"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Confirms */}
        {showConfirmRegister && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-8 animate-fade-in">
            <div className="bg-white rounded-[4rem] p-10 w-full max-w-sm text-center shadow-3xl border border-slate-100 animate-zoom-in">
              <div className="text-6xl mb-8">🚒</div>
              <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase italic leading-none">Confirmer ?</h4>
              <p className="text-[10px] text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest">
                Validez-vous votre participation à cette session de formation ?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowConfirmRegister(false)} className="py-5 rounded-3xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all">Retour</button>
                <button 
                  onClick={() => { onRegister(training.id); setShowConfirmRegister(false); }} 
                  className="py-5 rounded-3xl bg-fire-red text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-200 active:scale-95 transition-all"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmUnregister && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-8 animate-fade-in">
            <div className="bg-white rounded-[4rem] p-10 w-full max-w-sm text-center shadow-3xl border border-slate-100 animate-zoom-in">
              <div className="text-6xl mb-8">🚪</div>
              <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase italic leading-none">Annuler ?</h4>
              <p className="text-[10px] text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest">
                Souhaitez-vous vraiment vous désinscrire de ce stage ?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowConfirmUnregister(false)} className="py-5 rounded-3xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all">Retour</button>
                <button 
                  onClick={() => { onUnregister(training.id); setShowConfirmUnregister(false); }} 
                  className="py-5 rounded-3xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showConfirmValidate && (
          <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-white rounded-[4rem] p-8 w-full max-w-md text-center shadow-3xl border border-emerald-100 flex flex-col max-h-[85vh] animate-zoom-in">
                <div className="shrink-0 mb-6">
                   <div className="text-5xl mb-4 text-emerald-500">📋</div>
                   <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase italic">Appel</h4>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Cochez les agents présents.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto mb-8 bg-slate-50/50 rounded-[3rem] p-4 space-y-3 border border-slate-100 scrollbar-none">
                   {registeredParticipants.map(p => (
                     <div 
                       key={p.id}
                       onClick={() => handleToggleAttendance(p.id)}
                       className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all border-2 ${
                         attendance[p.id] 
                          ? 'bg-white border-emerald-500 shadow-md scale-[1.02]' 
                          : 'bg-transparent border-transparent opacity-40'
                       }`}
                     >
                       <div className="text-2xl italic">{renderRankIcon(p.rank)}</div>
                       <div className="flex-1 text-left">
                         <p className="font-black text-slate-900 text-xs uppercase tracking-tight italic">{p.lastName}</p>
                       </div>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                         attendance[p.id] ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200'
                       }`}>
                         {attendance[p.id] && '✓'}
                       </div>
                     </div>
                   ))}
                </div>

                <div className="grid grid-cols-2 gap-4 shrink-0">
                  <button onClick={() => setShowConfirmValidate(false)} className="py-5 rounded-[2rem] bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Annuler</button>
                  <button 
                    onClick={handleValidate} 
                    className="py-5 rounded-[2rem] bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/30 active:scale-95 transition-all"
                  >
                    Clôturer
                  </button>
                </div>
             </div>
          </div>
        )}

        {showConfirmDelete && (
          <div className="fixed inset-0 bg-red-600/20 backdrop-blur-sm z-[100] flex items-center justify-center p-8 animate-fade-in">
            <div className="bg-white rounded-[4rem] p-10 w-full max-w-sm text-center shadow-3xl border-4 border-fire-red animate-zoom-in">
              <div className="text-6xl mb-8">🗑️</div>
              <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase italic leading-none">Supprimer ?</h4>
              <p className="text-[10px] text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest">
                Action irréversible.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowConfirmDelete(false)} className="py-5 rounded-3xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Retour</button>
                <button 
                  onClick={handleDelete} 
                  className="py-5 rounded-3xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95 transition-all"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingDetailModal;
