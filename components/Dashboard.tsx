
import React, { useState } from 'react';
import { User, Training } from '../types';
import { getCareerAdvice } from '../services/geminiService';
import { calculateFcesStatus } from '../utils/fces';

interface DashboardProps {
  user: User;
  trainings: Training[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, trainings }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const fces = calculateFcesStatus(user.fcesDate);

  const trainingHours = trainings
    .filter(t => t.isCompleted)
    .filter(t => {
      const listToCheck = t.presentUserIds && t.presentUserIds.length > 0 
        ? t.presentUserIds 
        : t.registeredUserIds;
      return listToCheck.includes(user.id);
    })
    .reduce((total, t) => {
      const days = t.durationDays || 1;
      const hours = t.hoursPerDay || 7;
      return total + (days * hours);
    }, 0);

  const nextTraining = trainings
    .filter(t => t.registeredUserIds.includes(user.id))
    .filter(t => new Date(t.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const handleGetCoachAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const result = await getCareerAdvice(user);
      setAdvice(result);
    } catch (error) {
      setAdvice("Le coach est momentanément indisponible.");
    } finally {
      setLoadingAdvice(false);
    }
  };

  const statusColors = {
    VALID: 'bg-emerald-500 border-emerald-100 text-emerald-600',
    WARNING: 'bg-amber-500 border-amber-100 text-amber-600',
    EXPIRED: 'bg-fire-red border-red-100 text-fire-red'
  };

  const statusLabels = {
    VALID: 'APTE OPÉRATIONNEL',
    WARNING: 'ÉCHÉANCE PROCHE',
    EXPIRED: 'HORS RANG (FCES)'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* FCES Status Card Premium */}
      <div className={`relative overflow-hidden p-8 rounded-[3rem] shadow-2xl border-4 bg-white transition-all duration-500 ${
        fces.status === 'VALID' ? 'border-emerald-50' : fces.status === 'WARNING' ? 'border-amber-50' : 'border-red-50'
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 -mr-20 -mt-20 blur-3xl rounded-full bg-slate-900"></div>
        
        <div className="relative flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Statut Aptitude</h2>
            <p className={`text-3xl font-black italic uppercase leading-none tracking-tighter ${
              fces.status === 'VALID' ? 'text-emerald-600' : fces.status === 'WARNING' ? 'text-amber-600' : 'text-fire-red'
            }`}>
              {statusLabels[fces.status]}
              <span className="text-slate-900 ml-1">.</span>
            </p>
          </div>
          <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-3xl shadow-xl ${statusColors[fces.status].split(' ')[0]} text-white transform hover:rotate-12 transition-transform`}>
            {fces.status === 'VALID' ? '🔥' : fces.status === 'WARNING' ? '⚠️' : '🚨'}
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end mb-1 px-1">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progression annuelle</span>
               <span className="text-[9px] font-black text-slate-900 uppercase italic">Validité {new Date(user.fcesDate).getFullYear() + 1}</span>
            </div>
            <div className="h-4 bg-slate-50 rounded-full overflow-hidden shadow-inner p-1">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${
                  fces.status === 'VALID' ? 'w-[100%] bg-emerald-500' : fces.status === 'WARNING' ? 'w-[30%] bg-amber-500' : 'w-[5%] bg-fire-red'
                }`}
              />
            </div>
          </div>
          
          <div className={`p-5 rounded-[2rem] text-sm font-bold leading-relaxed border transition-all ${
            fces.status === 'VALID' ? 'bg-emerald-50/30 border-emerald-100 text-emerald-800' : fces.status === 'WARNING' ? 'bg-amber-50/30 border-amber-100 text-amber-800' : 'bg-red-50/30 border-red-100 text-red-800 font-black italic'
          }`}>
            {fces.message}
          </div>
        </div>

        {fces.status !== 'VALID' && (
          <button className="w-full mt-6 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black active:scale-95 transition-all">
            {fces.status === 'WARNING' ? 'Prendre un créneau de recyclage' : 'Réactivation immédiate requise'}
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-7 rounded-[2.5rem] shadow-lg border-2 border-slate-50 flex flex-col justify-center items-center text-center group hover:border-fire-red/20 transition-all">
          <p className="text-slate-400 text-[9px] uppercase font-black tracking-[0.3em] mb-2">Spécialités</p>
          <div className="relative">
             <p className="text-5xl font-black text-slate-900 italic tracking-tighter transition-transform group-hover:scale-110">{user.qualifications.length}</p>
             <div className="absolute -bottom-2 left-0 right-0 h-1 bg-fire-red/20 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </div>
        </div>
        
        <div className="bg-white p-7 rounded-[2.5rem] shadow-lg border-2 border-slate-50 flex flex-col justify-center items-center text-center group hover:border-emerald-500/20 transition-all">
          <p className="text-slate-400 text-[9px] uppercase font-black tracking-[0.3em] mb-2">Heures totales</p>
          <div className="relative">
            <p className="text-5xl font-black text-slate-900 italic tracking-tighter transition-transform group-hover:scale-110">{trainingHours}<span className="text-xl">h</span></p>
             <div className="absolute -bottom-2 left-0 right-0 h-1 bg-emerald-500/20 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </div>
        </div>
      </div>

      {/* Convocation Card Premium */}
      {nextTraining && (
        <div className="bg-white rounded-[3rem] border-[3px] border-slate-900 p-8 flex items-center justify-between shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
           <div className="flex-1 pr-6 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-2 h-2 rounded-full bg-fire-red animate-pulse"></div>
                 <p className="text-fire-red text-[10px] font-black uppercase tracking-[0.3em]">Ordre de convocation</p>
              </div>
              <h3 className="text-3xl font-black text-slate-900 italic uppercase leading-[0.9] tracking-tighter">
                 {nextTraining.title}
              </h3>
              <div className="flex flex-col gap-1 mt-4">
                <p className="text-[11px] font-black text-slate-900 uppercase">
                  🗓️ {new Date(nextTraining.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  📍 {nextTraining.location}
                </p>
              </div>
           </div>
           <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center text-2xl shrink-0 shadow-2xl transform transition-transform group-hover:rotate-12">
              🚒
           </div>
        </div>
      )}

      {/* AI AI AI Coach Section */}
      <div className="bg-slate-900 p-8 rounded-[3.2rem] shadow-2xl text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full -mr-20 -mt-20 blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-[2s]"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-fire-red/5 rounded-full -ml-10 -mb-10 blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-[1.8rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center text-3xl shadow-3xl transform group-hover:rotate-6 transition-transform">🤖</div>
            <div>
              <h3 className="font-black italic uppercase text-xl leading-none tracking-tighter mb-1">Elite Coach AI</h3>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] opacity-80">Parade Opérationnelle v2.4</p>
            </div>
          </div>
          
          {advice ? (
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.2rem] text-sm font-semibold leading-relaxed mb-6 border border-white/20 italic shadow-inner animate-in fade-in slide-in-from-bottom-2">
              "{advice}"
            </div>
          ) : (
            <div className="space-y-4 mb-8">
               <p className="text-[11px] text-slate-300 font-bold leading-relaxed uppercase tracking-wide">
                L'intelligence artificielle analyse votre spécialité et vos échéances pour vous proposer la meilleure trajectoire de carrière.
              </p>
            </div>
          )}

          <button 
            onClick={handleGetCoachAdvice}
            disabled={loadingAdvice}
            className={`w-full py-5 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.25em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
              loadingAdvice ? 'bg-slate-800' : 'bg-white text-slate-900 hover:bg-fire-red hover:text-white'
            }`}
          >
            {loadingAdvice ? (
              <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              advice ? "Réactualiser le Diagnostic" : "Lancer le Diagnostic Carrière"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

