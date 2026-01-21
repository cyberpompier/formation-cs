
import React, { useState, useEffect } from 'react';
import { User, Rank, ALL_QUALIFICATIONS } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  initialEditMode?: boolean;
  onConsumeEditMode?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout, initialEditMode, onConsumeEditMode }) => {
  const [isEditing, setIsEditing] = useState(!!initialEditMode);
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    if (initialEditMode) {
      setIsEditing(true);
      if (onConsumeEditMode) {
        onConsumeEditMode();
      }
    }
  }, [initialEditMode, onConsumeEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleQualification = (qual: string) => {
    setFormData(prev => {
      const exists = prev.qualifications.includes(qual);
      if (exists) {
        return { ...prev, qualifications: prev.qualifications.filter(q => q !== qual) };
      } else {
        return { ...prev, qualifications: [...prev.qualifications, qual] };
      }
    });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper pour les blocs d'affichage avec texte BLANC FORCÉ
  const DisplayBlock: React.FC<{ value: string; icon: string; highlight?: boolean }> = ({ value, icon, highlight }) => (
    <div className={`${highlight ? 'bg-fire-red shadow-fire-red/20' : 'bg-slate-900 shadow-slate-900/10'} p-4 rounded-2xl mb-3 flex items-center justify-center gap-3 border border-white/10 shadow-lg transition-all active:scale-95`}>
      <span className="text-xl shrink-0">{icon}</span>
      <span className="font-bold text-sm tracking-wide text-white !text-white select-text">
        {value}
      </span>
    </div>
  );

  // Helper pour les textes d'aide (gris clair)
  const InputHelper: React.FC<{ text: string }> = ({ text }) => (
    <p className="text-[10px] text-slate-400 font-bold mt-1 ml-14 italic tracking-wide">
      Exemple : {text}
    </p>
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Section En-tête : Photo & Grade Principal */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-24 bg-slate-50 -z-0"></div>

        <div className="relative mb-8 z-10">
          <div className="w-36 h-36 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center text-5xl text-white font-black shadow-2xl border-4 border-white ring-8 ring-slate-50">
            {formData.profilePic ? (
              <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(formData.firstName, formData.lastName)
            )}
          </div>
          {isEditing && (
            <label htmlFor="profile-pic-upload" className="absolute -bottom-2 -right-2 bg-fire-red text-white p-3 rounded-2xl cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-white z-20">
              <span className="text-lg">📸</span>
              <input id="profile-pic-upload" type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="w-full z-10">
          {isEditing ? (
            <div className="space-y-5">
              <div className="relative group">
                <span className="absolute left-4 top-4 text-slate-400 group-focus-within:text-fire-red transition-colors">👤</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-bold text-slate-800 transition-all bg-slate-50"
                />
                <InputHelper text="Jean, Marie, Pierre..." />
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-4 text-slate-400 group-focus-within:text-fire-red transition-colors">📛</span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-bold text-slate-800 transition-all bg-slate-50"
                />
                <InputHelper text="Dupont, Martin..." />
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-4 text-slate-400 group-focus-within:text-fire-red transition-colors">🎖️</span>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-200 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-bold text-slate-800 appearance-none bg-slate-50 cursor-pointer"
                >
                  {Object.values(Rank).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
                <InputHelper text="Sélectionnez votre grade actuel" />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <DisplayBlock icon="🧑‍🚒" value={`${user.firstName} ${user.lastName}`} highlight />
              <DisplayBlock icon="🎖️" value={user.rank} />
            </div>
          )}
        </div>

        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="mt-6 bg-slate-100 text-slate-600 px-6 py-2.5 rounded-2xl transition-all hover:bg-fire-red/10 hover:text-fire-red text-xs font-black uppercase tracking-widest flex items-center gap-2"
          >
            ✏️ MODIFIER LE PROFIL
          </button>
        )}
      </div>

      {/* Détails : Coordonnées & Affectation */}
      <div className={`bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8 ${isEditing ? 'animate-in slide-in-from-bottom-4 duration-500' : ''}`}>
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-8 h-[2px] bg-slate-100"></span> COORDONNÉES
          </h4>
          {isEditing ? (
            <div className="space-y-4">
              <div className="relative group">
                <span className="absolute left-4 top-4 text-slate-400">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Professionnel"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none text-sm transition-all bg-slate-50 font-semibold text-slate-800"
                />
                <InputHelper text="jean.dupont@sdis.fr" />
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-4 text-slate-400">📱</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none text-sm transition-all bg-slate-50 font-semibold text-slate-800"
                />
                <InputHelper text="06 12 34 56 78" />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <DisplayBlock icon="✉️" value={user.email} />
              <DisplayBlock icon="📱" value={user.phone} />
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-8 h-[2px] bg-slate-100"></span> AFFECTATION
          </h4>
          {isEditing ? (
            <div className="space-y-4">
              <div className="relative group">
                <span className="absolute left-4 top-4 text-slate-400">🏢</span>
                <input
                  type="text"
                  name="center"
                  placeholder="Centre de Secours / Unité"
                  value={formData.center}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none text-sm transition-all bg-slate-50 font-semibold text-slate-800"
                />
                <InputHelper text="CS Principal, CIS Lyon, CPI Nord..." />
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-4 text-slate-400">📍</span>
                <input
                  type="text"
                  name="sdis"
                  placeholder="Département / SDIS"
                  value={formData.sdis}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none text-sm transition-all bg-slate-50 font-semibold text-slate-800"
                />
                <InputHelper text="SDIS 75, BSPP, SDIS 33..." />
              </div>
            </div>
          ) : (
            <DisplayBlock icon="🚒" value={`${user.center} • ${user.sdis}`} />
          )}
        </section>
      </div>

      {/* Qualifications */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] flex items-center gap-3">
             <span className="w-2 h-6 bg-fire-red rounded-full"></span> QUALIFICATIONS
          </h3>
          <span className="text-[10px] font-black text-white bg-slate-900 px-4 py-1.5 rounded-full shadow-lg">
            {formData.qualifications.length} ACQUIS
          </span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {ALL_QUALIFICATIONS.map(q => {
            const isSelected = formData.qualifications.includes(q);
            if (!isEditing && !isSelected) return null;
            
            return (
              <button
                key={q}
                type="button"
                disabled={!isEditing}
                onClick={() => toggleQualification(q)}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                  isSelected 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-100' 
                    : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'
                } ${!isEditing ? 'cursor-default' : 'active:scale-90'}`}
              >
                {q}
              </button>
            );
          })}
          {user.qualifications.length === 0 && !isEditing && (
            <div className="w-full text-center py-10 border-4 border-dashed border-slate-50 rounded-[2rem]">
              <p className="text-slate-300 text-sm italic font-bold">Aucun diplôme renseigné.</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 px-2">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleSave}
              className="bg-fire-red text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-fire-red/40 active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
              Enregistrer
            </button>
            <button 
              onClick={handleCancel}
              className="bg-slate-900 text-white font-black py-5 rounded-[1.5rem] active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button 
            onClick={onLogout}
            className="w-full bg-red-50 text-red-600 font-black py-5 rounded-[1.5rem] hover:bg-red-100 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3 border border-red-100"
          >
            <span>🚪</span> DÉCONNEXION
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
