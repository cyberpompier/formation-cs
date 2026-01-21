
import React, { useState } from 'react';
import { Training, User, Rank, ALL_QUALIFICATIONS, TrainingType } from '../types';

interface TrainingDetailModalProps {
  training: Training;
  currentUser: User;
  allUsers: User[];
  onRegister: (trainingId: string) => void;
  onUnregister: (trainingId: string) => void;
  onValidateTraining: (trainingId: string) => void;
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
  const [showConfirmUnregister, setShowConfirmUnregister] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Training>(training);

  const isRegistered = training.registeredUserIds.includes(currentUser.id);
  const isFull = training.registeredUserIds.length >= training.slots;
  const isTrainingCompleted = training.isCompleted;
  
  // Peut éditer si admin ou formateur
  const canEdit = currentUser.isTrainer || currentUser.isAdmin;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'slots' || name === 'durationDays') ? parseInt(value) : value
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

  const handleCancelEdit = () => {
    setFormData(training);
    setIsEditing(false);
  };

  return (
    /* Passage à z-[60] pour recouvrir la barre de navigation z-50 */
    <div className="fixed inset-0 bg-slate-900/98 backdrop-blur-lg z-[60] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white rounded-none w-full h-full relative animate-in slide-in-from-bottom duration-500 flex flex-col shadow-2xl overflow-hidden">
        
        {/* BOUTON ÉDITION - En haut à gauche */}
        {!isEditing && canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-6 left-6 z-[70] w-14 h-14 flex items-center justify-center bg-white/90 rounded-full shadow-2xl transition-all active:scale-75 border border-slate-100 text-slate-900 hover:text-fire-red hover:bg-white"
          >
            ✏️
          </button>
        )}

        {/* Bouton de Fermeture flottant - z-index 70 pour rester au-dessus de tout */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 text-4xl z-[70] w-14 h-14 flex items-center justify-center bg-white/90 rounded-full shadow-2xl transition-all active:scale-75 border border-slate-100"
        >
          &times;
        </button>

        {/* 1. Hero Section (Fixe en haut) */}
        <div className="relative h-60 bg-slate-200 shrink-0 group">
          <img 
            src={formData.image || `https://picsum.photos/400/200?random=${training.id}`} 
            alt={training.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            {isEditing ? (
              <div className="mb-3">
                 <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="bg-fire-red text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest shadow-xl outline-none border-2 border-white/20 cursor-pointer"
                 >
                   {Object.values(TrainingType).map(t => (
                     <option key={t} value={t} className="text-slate-900">{t}</option>
                   ))}
                 </select>
              </div>
            ) : (
              <span className="bg-fire-red text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl mb-3 inline-block">
                {training.type}
              </span>
            )}
            
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b-2 border-white/50 focus:border-fire-red text-2xl font-black text-white uppercase italic tracking-tighter outline-none placeholder-white/50"
              />
            ) : (
              <h2 className="text-2xl font-black text-white leading-none uppercase italic tracking-tighter">{training.title}</h2>
            )}
          </div>

          {isEditing && (
             <div className="absolute top-6 left-24 right-24">
                <input 
                  type="text" 
                  name="image" 
                  value={formData.image || ''} 
                  onChange={handleInputChange}
                  placeholder="URL de l'image" 
                  className="w-full bg-black/50 backdrop-blur text-white text-xs p-2 rounded-lg border border-white/20"
                />
             </div>
          )}
        </div>

        {/* 2. Contenu de la formation (Déroulable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
          
          {/* Dashboard d'informations */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Date</p>
              {isEditing ? (
                 <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-white p-2 rounded-lg font-bold text-slate-900 text-sm outline-none border focus:border-fire-red"
                 />
              ) : (
                <p className="font-black text-slate-900 text-base uppercase italic">{new Date(formData.date).toLocaleDateString('fr-FR')}</p>
              )}
            </div>

            {/* Places */}
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Places Totales</p>
              {isEditing ? (
                 <input
                  type="number"
                  name="slots"
                  value={formData.slots}
                  onChange={handleInputChange}
                  className="w-full bg-white p-2 rounded-lg font-bold text-slate-900 text-sm outline-none border focus:border-fire-red"
                 />
              ) : (
                <p className="font-black text-slate-900 text-base uppercase italic">
                  {training.slots - training.registeredUserIds.length} libres / {training.slots}
                </p>
              )}
            </div>

            {/* Heure et Durée */}
            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Heure Début</p>
              {isEditing ? (
                 <input
                  type="time"
                  name="startTime"
                  value={formData.startTime || ''}
                  onChange={handleInputChange}
                  className="w-full bg-white p-2 rounded-lg font-bold text-slate-900 text-sm outline-none border focus:border-fire-red"
                 />
              ) : (
                <p className="font-black text-slate-900 text-base uppercase italic">{formData.startTime || '08:00'}</p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Durée (Jours)</p>
              {isEditing ? (
                 <input
                  type="number"
                  name="durationDays"
                  min="1"
                  value={formData.durationDays || 1}
                  onChange={handleInputChange}
                  className="w-full bg-white p-2 rounded-lg font-bold text-slate-900 text-sm outline-none border focus:border-fire-red"
                 />
              ) : (
                <p className="font-black text-slate-900 text-base uppercase italic">{formData.durationDays || 1} jour(s)</p>
              )}
            </div>

            {/* Lieu */}
            <div className="col-span-2 bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex justify-between items-center">
              <div className="w-full mr-4">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Lieu de rendez-vous</p>
                {isEditing ? (
                   <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-white p-2 rounded-lg font-bold text-slate-900 text-sm outline-none border focus:border-fire-red"
                   />
                ) : (
                  <p className="font-black text-slate-900 uppercase italic truncate">{formData.location}</p>
                )}
              </div>
              {!isEditing && (
                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-xl shadow-md border border-slate-200 text-fire-red active:scale-90 transition-transform">
                  📍
                </a>
              )}
            </div>
          </div>

          {/* Formateurs (Visible en tout temps, éditable en mode édition) */}
          <section>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3 border-l-4 border-fire-red pl-3">Encadrement</h3>
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Formateur 1</p>
                 {isEditing ? (
                   <input type="text" name="trainer1" value={formData.trainer1 || ''} onChange={handleInputChange} className="w-full text-xs font-bold bg-white p-1 rounded border" placeholder="Nom du formateur" />
                 ) : (
                   <p className="text-xs font-bold text-slate-900">{formData.trainer1 || 'Non défini'}</p>
                 )}
               </div>
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Formateur 2</p>
                 {isEditing ? (
                   <input type="text" name="trainer2" value={formData.trainer2 || ''} onChange={handleInputChange} className="w-full text-xs font-bold bg-white p-1 rounded border" placeholder="Optionnel" />
                 ) : (
                   <p className="text-xs font-bold text-slate-900">{formData.trainer2 || '-'}</p>
                 )}
               </div>
            </div>
          </section>

          {/* Pré-requis (Editable) */}
          {(isEditing || formData.prerequisites.length > 0) && (
            <section>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3 border-l-4 border-fire-red pl-3">Pré-requis</h3>
              {isEditing ? (
                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  {ALL_QUALIFICATIONS.map(qual => (
                    <button
                      key={qual}
                      onClick={() => handleTogglePrerequisite(qual)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${
                        formData.prerequisites.includes(qual)
                          ? 'bg-fire-red text-white shadow-md'
                          : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {qual}
                    </button>
                  ))}
                </div>
              ) : (
                 <div className="flex flex-wrap gap-2">
                    {formData.prerequisites.map(p => (
                      <span key={p} className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-md uppercase">
                        {p}
                      </span>
                    ))}
                 </div>
              )}
            </section>
          )}

          {/* Description pédagogique */}
          <section>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3 border-l-4 border-fire-red pl-3">
              Programme du stage
            </h3>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-sm text-slate-900 leading-relaxed outline-none border focus:border-fire-red resize-none"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed font-bold text-sm">
                {formData.description}
              </p>
            )}
          </section>

          {/* Liste des participants (Caché en mode édition pour focus) */}
          {!isEditing && (
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
          )}

          {/* ACTIONS */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <button
                    onClick={handleCancelEdit}
                    className="w-full py-5 rounded-[1.5rem] bg-slate-100 text-slate-600 font-black text-[12px] uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="w-full py-5 rounded-[1.5rem] bg-fire-red text-white font-black text-[12px] uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95 transition-all"
                  >
                    Enregistrer
                  </button>
                </div>
                
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-full py-4 rounded-[1.5rem] border-2 border-red-50 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 active:scale-95 transition-all"
                >
                  Supprimer ce stage
                </button>
              </div>
            ) : isTrainingCompleted ? (
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
                {/* Affichage des pré-requis manquants */}
                {!isRegistered && missingPreqs.length > 0 && (
                  <div className="bg-red-50 p-5 rounded-[2rem] border border-red-100 mb-2">
                    <p className="text-[10px] font-black text-red-600 uppercase mb-3 tracking-widest flex items-center gap-2">
                      <span className="animate-pulse">⚠️</span> Diplômes manquants à votre profil :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingPreqs.map(p => (
                        <span key={p} className="bg-fire-red text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-md uppercase">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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
                    Motif : {blockReason}
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

      {/* Confirmation Suppression (Overlay supérieur) */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-fire-red/90 z-[100] flex items-center justify-center p-8 animate-in zoom-in duration-200 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-sm text-center shadow-2xl border-4 border-red-500">
            <div className="text-6xl mb-6">🗑️</div>
            <h4 className="text-2xl font-black text-red-600 mb-4 uppercase italic leading-none">Supprimer ?</h4>
            <p className="text-sm text-slate-500 font-bold mb-8 leading-relaxed uppercase tracking-widest">
              Cette action est irréversible. Le stage sera retiré du catalogue.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowConfirmDelete(false)} className="py-5 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                Annuler
              </button>
              <button 
                onClick={handleDelete}
                className="py-5 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95 transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDetailModal;
