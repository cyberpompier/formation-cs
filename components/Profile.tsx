
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

  // Helper pour les blocs d'affichage Ultra Modernes
  const DisplayBlock: React.FC<{ value: string; icon: string; highlight?: boolean }> = ({ value, icon, highlight }) => (
    <div className={`relative overflow-hidden group ${highlight ? 'bg-gradient-to-br from-fire-red to-red-700 shadow-red-500/30' : 'bg-gradient-to-br from-slate-900 to-slate-800 shadow-slate-900/30'} p-5 rounded-[2rem] mb-4 flex items-center gap-5 border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 w-full`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-2xl shrink-0 z-10 transition-transform duration-500 group-hover:rotate-6 ${highlight ? 'bg-white/20' : 'bg-white/10'} shadow-inner`}>
        {icon}
      </div>
      <span className="font-black text-lg sm:text-xl tracking-tight text-white z-10 drop-shadow-md truncate">
        {value}
      </span>
    </div>
  );

  const InfoBlock: React.FC<{ value: string; icon: string; label: string }> = ({ value, icon, label }) => (
    <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-lg flex items-center gap-5 group hover:border-fire-red/20 transition-all duration-300">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:bg-fire-red/5 transition-all">
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase mb-0.5">{label}</p>
        <p className="font-bold text-slate-900 text-sm truncate">{value}</p>
      </div>
    </div>
  );

  const InputHelper: React.FC<{ text: string }> = ({ text }) => (
    <p className="text-[9px] text-slate-400 font-bold mt-2 ml-4 uppercase tracking-widest flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Ex: {text}
    </p>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-2xl mx-auto">
      {/* 🚀 Header Profile Ultra Premium */}
      <div className="relative bg-white rounded-[3rem] p-8 md:p-10 shadow-3xl border-4 border-slate-50 flex flex-col items-center overflow-hidden group">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-slate-900 to-slate-800 transition-all duration-700 group-hover:h-48 rounded-b-[4rem]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-fire-red/20 blur-[80px] rounded-full mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full mix-blend-overlay"></div>

        <div className="relative mb-10 mt-6 z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center text-6xl text-white font-black shadow-2xl border-8 border-white relative z-10 transition-transform duration-500 group-hover:scale-105 bg-center bg-cover">
              {formData.profilePic ? (
                <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                 getInitials(formData.firstName, formData.lastName)
              )}
            </div>
            {/* Halo effect behind avatar */}
            <div className="absolute inset-[-10px] rounded-full bg-gradient-to-tr from-fire-red to-blue-600 opacity-20 blur-xl animate-pulse"></div>
            
            {isEditing && (
              <label htmlFor="profile-pic-upload" className="absolute bottom-0 right-0 bg-fire-red text-white w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 transition-transform border-4 border-white z-20">
                <span className="text-xl">📸</span>
                <input id="profile-pic-upload" type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
              </label>
            )}
          </div>
          
          {/* Status Badge */}
          {!isEditing && (
             <div className="mt-4 bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30 flex items-center gap-2 border-2 border-white">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Opérationnel
             </div>
          )}
        </div>

        <div className="w-full z-10">
          {isEditing ? (
            <div className="space-y-5 bg-white/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 shadow-xl">
              <div className="relative group">
                <span className="absolute left-6 top-[18px] text-xl transition-transform group-focus-within:scale-125 group-focus-within:rotate-6">👤</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-6 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-black text-slate-800 transition-all bg-white shadow-sm"
                />
                <InputHelper text="Jean, Marie, Pierre..." />
              </div>
              <div className="relative group">
                <span className="absolute left-6 top-[18px] text-xl transition-transform group-focus-within:scale-125 group-focus-within:rotate-6">📛</span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-6 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-black text-slate-800 transition-all bg-white shadow-sm uppercase uppercase"
                />
                <InputHelper text="Dupont, Martin..." />
              </div>
              <div className="relative group">
                <span className="absolute left-6 top-[18px] text-xl transition-transform group-focus-within:scale-125 group-focus-within:rotate-6">🎖️</span>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-12 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-black text-slate-800 appearance-none bg-white cursor-pointer shadow-sm"
                >
                  {Object.values(Rank).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-[22px] w-4 h-4 text-slate-400 pointer-events-none flex flex-col justify-center items-center">
                   <div className="w-3 h-[2px] bg-slate-400 rounded-full rotate-45 translate-x-[4px]"></div>
                   <div className="w-3 h-[2px] bg-slate-400 rounded-full -rotate-45 -translate-x-[4px] -translate-y-[2px]"></div>
                </div>
                <InputHelper text="Sélectionnez votre grade" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1 px-4">
              <DisplayBlock icon="🧑‍🚒" value={`${user.firstName} ${user.lastName.toUpperCase()}`} highlight />
              <DisplayBlock icon="🎖️" value={user.rank} />
            </div>
          )}
        </div>

        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="mt-6 bg-slate-50 text-slate-500 w-full py-5 rounded-[2rem] transition-all hover:bg-slate-900 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 border border-slate-100 hover:shadow-2xl active:scale-95"
          >
            ✏️ Mettre à jour le profil
          </button>
        )}
      </div>

      {/* 🚀 Sections Coordonnées & Affectation dynamiques */}
      <div className={`space-y-6 ${isEditing ? 'animate-in slide-in-from-bottom-6 duration-700' : ''}`}>
        <div className="bg-slate-50/50 p-6 sm:p-8 rounded-[3rem] border border-slate-100 shadow-inner">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-1.5 h-6 bg-fire-red rounded-full"></div>
            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Contact & Affectation</h4>
          </div>

          {isEditing ? (
            <div className="space-y-5">
              <div className="relative group">
                <span className="absolute left-6 top-[18px] text-xl">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Professionnel"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-6 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-bold text-slate-800 transition-all bg-white shadow-sm"
                />
              </div>
              <div className="relative group">
                <span className="absolute left-6 top-[18px] text-xl">📱</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone Numérique"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-6 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-bold text-slate-800 transition-all bg-white shadow-sm"
                />
              </div>
              <div className="flex gap-4">
                 <div className="relative group flex-1">
                   <span className="absolute left-4 top-[18px] text-xl">🏢</span>
                   <input
                     type="text"
                     name="center"
                     placeholder="Centre"
                     value={formData.center}
                     onChange={handleInputChange}
                     className="w-full pl-12 pr-4 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-bold text-slate-800 transition-all bg-white shadow-sm text-sm"
                   />
                 </div>
                 <div className="relative group flex-1">
                   <span className="absolute left-4 top-[18px] text-xl">📍</span>
                   <input
                     type="text"
                     name="sdis"
                     placeholder="Département"
                     value={formData.sdis}
                     onChange={handleInputChange}
                     className="w-full pl-12 pr-4 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-fire-red focus:ring-4 focus:ring-fire-red/10 outline-none font-bold text-slate-800 transition-all bg-white shadow-sm text-sm"
                   />
                 </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBlock label="Email Principal" value={user.email} icon="✉️" />
              <InfoBlock label="Téléphone Mobile" value={user.phone} icon="📱" />
              <div className="md:col-span-2">
                 <InfoBlock label="Affectation Opérationnelle" value={`${user.center} — ${user.sdis}`} icon="🚒" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 Qualifications Block */}
      <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-slate-800 rounded-full blur-[60px] group-hover:bg-fire-red/20 transition-colors duration-1000"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-slate-800 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-colors duration-1000"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black uppercase text-xl italic tracking-tighter flex items-center gap-3">
               Qualifications
            </h3>
            <span className="text-[10px] font-black text-slate-900 bg-white px-4 py-2 rounded-xl shadow-lg uppercase tracking-widest">
              {formData.qualifications.length} Spécialités
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
                  className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'bg-fire-red border-fire-red text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-[1.02]' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/10'
                  } ${!isEditing ? 'cursor-default' : 'active:scale-95'}`}
                >
                  {q}
                </button>
              );
            })}
            {user.qualifications.length === 0 && !isEditing && (
              <div className="w-full text-center py-12 border-2 border-dashed border-white/20 rounded-[2.5rem] bg-white/5 backdrop-blur-sm">
                <div className="text-4xl mb-3 opacity-50">🎓</div>
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">Aucune spécialité validée</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 Actions Finales */}
      <div className="px-2 pt-4">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-2">
            <button 
              onClick={handleCancel}
              className="bg-slate-100 text-slate-600 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all hover:bg-slate-200"
            >
              Annuler
            </button>
            <button 
              onClick={handleSave}
              className="bg-fire-red text-white py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-fire-red/30 active:scale-95 transition-all hover:bg-red-700"
            >
              Sauvegarder
            </button>
          </div>
        ) : (
          <button 
            onClick={onLogout}
            className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-3 border-[3px] border-slate-900 hover:bg-red-600 hover:border-red-600 shadow-2xl group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-fire-red translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
            <div className="relative z-10 flex items-center gap-3 group-hover:text-white">
              <span className="text-xl group-hover:-translate-x-2 transition-transform">🚪</span> 
              Fermer la session
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
