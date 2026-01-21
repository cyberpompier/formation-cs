
import React from 'react';
import { User, Rank, ALL_QUALIFICATIONS } from '../types';
import { calculateFcesStatus } from '../utils/fces';

interface StaffProfileModalProps {
  user: User;
  onClose: () => void;
}

const StaffProfileModal: React.FC<StaffProfileModalProps> = ({ user, onClose }) => {
  const fces = calculateFcesStatus(user.fcesDate);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const DisplayBlock: React.FC<{ value: string; icon: string; highlight?: boolean; label: string }> = ({ value, icon, highlight, label }) => (
    <div className={`${highlight ? 'bg-fire-red shadow-fire-red/20' : 'bg-slate-900'} p-4 rounded-2xl flex flex-col gap-1 border border-white/10 shadow-lg`}>
      <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-3">
        <span className="text-xl shrink-0">{icon}</span>
        <span className="font-bold text-sm tracking-wide text-white select-text">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[60] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-xl sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header avec bouton retour */}
        <div className="p-6 flex items-center gap-4 border-b border-slate-100">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-2xl text-2xl active:scale-75 transition-transform"
          >
            ←
          </button>
          <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Détail Agent</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-12">
          {/* Section Identité */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center text-4xl text-white font-black shadow-2xl border-4 border-white mb-6">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(user.firstName, user.lastName)
              )}
            </div>
            <div className="w-full space-y-3">
              <DisplayBlock label="Identité" icon="🧑‍🚒" value={`${user.firstName} ${user.lastName}`} highlight />
              <DisplayBlock label="Grade actuel" icon="🎖️" value={user.rank} />
            </div>
          </div>

          {/* État Aptitude Secourisme */}
          <div className={`p-6 rounded-[2rem] border-2 flex items-center justify-between ${
            fces.status === 'VALID' ? 'bg-green-50 border-green-100 text-green-700' : 
            fces.status === 'WARNING' ? 'bg-orange-50 border-orange-100 text-orange-700' : 
            'bg-red-50 border-red-100 text-red-600'
          }`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Aptitude Secourisme</p>
              <p className="font-black italic text-lg uppercase leading-none mb-2">
                {fces.status === 'VALID' ? 'Agent Apte' : fces.status === 'WARNING' ? 'Échéance Proche' : 'Hors Rang'}
              </p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">
                Dernier recyclage : {new Date(user.fcesDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <span className="text-4xl">{fces.status === 'VALID' ? '✅' : fces.status === 'WARNING' ? '⏳' : '🚫'}</span>
          </div>

          {/* Contact & Affectation */}
          <section className="space-y-3">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-4">
               <span className="w-8 h-[2px] bg-slate-100"></span> Contact & Affectation
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <DisplayBlock label="Email professionnel" icon="✉️" value={user.email} />
              <DisplayBlock label="Ligne directe" icon="📱" value={user.phone} />
              <DisplayBlock label="Unité d'affectation" icon="🚒" value={`${user.center} (${user.sdis})`} />
            </div>
          </section>

          {/* Qualifications */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] flex items-center gap-3">
                 <span className="w-2 h-6 bg-fire-red rounded-full"></span> Qualifications ({user.qualifications.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.qualifications.length > 0 ? (
                user.qualifications.map(q => (
                  <span key={q} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
                    {q}
                  </span>
                ))
              ) : (
                <div className="w-full text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-400 text-xs font-bold italic uppercase">Aucun diplôme enregistré</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
           <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all"
           >
             Fermer la fiche
           </button>
        </div>
      </div>
    </div>
  );
};

export default StaffProfileModal;
