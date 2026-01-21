
import React, { useState, useEffect } from 'react';
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
    VALID: 'bg-green-500 border-green-200 text-green-700',
    WARNING: 'bg-orange-500 border-orange-200 text-orange-700',
    EXPIRED: 'bg-red-600 border-red-200 text-red-700'
  };

  const statusLabels = {
    VALID: 'APTE',
    WARNING: 'ÉCHÉANCE PROCHE',
    EXPIRED: 'HORS RANG'
  };

  return (
    <div className="space-y-6">
      {/* FCES Status Card */}
      <div className={`relative overflow-hidden p-6 rounded-[2.5rem] shadow-2xl border-2 bg-white ${
        fces.status === 'VALID' ? 'border-green-100' : fces.status === 'WARNING' ? 'border-orange-100' : 'border-red-100'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Aptitude Secourisme (FCES)</h2>
            <p className={`text-2xl font-black italic uppercase leading-none ${
              fces.status === 'VALID' ? 'text-green-600' : fces.status === 'WARNING' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {statusLabels[fces.status]}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${statusColors[fces.status].split(' ')[0]} text-white`}>
            {fces.status === 'VALID' ? '✅' : fces.status === 'WARNING' ? '⏳' : '🚫'}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  fces.status === 'VALID' ? 'w-full bg-green-500' : fces.status === 'WARNING' ? 'w-2/3 bg-orange-500' : 'w-1/5 bg-red-500'
                }`}
              />
            </div>
            <span className="text-[10px] font-black text-slate-400">2026</span>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase">
              Dernier recyclage : <span className="text-slate-900">{new Date(user.fcesDate).toLocaleDateString('fr-FR')}</span>
            </p>
            {fces.daysRemaining && fces.status !== 'EXPIRED' && (
              <p className="text-[10px] font-black text-slate-400 uppercase italic">
                {fces.daysRemaining} jours restants
              </p>
            )}
          </div>
          
          <div className={`p-4 rounded-2xl text-[11px] font-bold leading-tight ${
            fces.status === 'VALID' ? 'bg-green-50 text-green-800' : fces.status === 'WARNING' ? 'bg-orange-50 text-orange-800' : 'bg-red-50 text-red-800'
          }`}>
            {fces.message}
          </div>
        </div>

        {fces.status !== 'VALID' && (
          <button className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
            {fces.status === 'WARNING' ? 'Anticiper mon recyclage' : 'S\'inscrire d\'urgence'}
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 group hover:border-fire-red transition-colors">
          <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Qualifications</p>
          <p className="text-3xl font-black text-slate-900 italic">{user.qualifications.length}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Heures Formation</p>
          <p className="text-3xl font-black text-slate-900 italic">12h</p>
        </div>
      </div>

      {/* AI Coach */}
      <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-fire-red/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-2xl shadow-xl">🤖</div>
            <div>
              <h3 className="font-black italic uppercase text-sm tracking-tighter">Coach Opérationnel</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Conseils personnalisés</p>
            </div>
          </div>
          
          {advice ? (
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl text-sm font-bold leading-relaxed mb-4 border border-white/10 italic">
              "{advice}"
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-bold mb-6 leading-relaxed">
              Consultez votre analyse de profil pour optimiser votre parcours de formation.
            </p>
          )}

          <button 
            onClick={handleGetCoachAdvice}
            disabled={loadingAdvice}
            className="w-full py-4 bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
          >
            {loadingAdvice ? (
              <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
            ) : (
              "Lancer l'analyse AI"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
