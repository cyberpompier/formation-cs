import React, { useState, useEffect } from 'react';
import { User, Training } from '../types';
import { getCareerAdvice } from '../services/geminiService';

interface DashboardProps {
  user: User;
  trainings: Training[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, trainings }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Filter trainings where user is registered and date is in future
  const myNextTraining = trainings
    .filter(t => t.registeredUserIds.includes(user.id) && new Date(t.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const handleGetCoachAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getCareerAdvice(user);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  return (
    <div className="space-y-6">
      {/* FCES Status Card */}
      <div className={`p-5 rounded-2xl shadow-sm border ${user.fcesValid ? 'bg-white border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg text-slate-800">État Opérationnel</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.fcesValid ? 'bg-green-100 text-green-700' : 'bg-red-200 text-red-800'}`}>
            {user.fcesValid ? 'Valide' : 'Alerte'}
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-2">
          Dernier recyclage: <strong>{new Date(user.fcesDate).toLocaleDateString('fr-FR')}</strong>
        </p>
        {!user.fcesValid && (
          <div className="flex items-start gap-2 text-red-600 text-sm mt-3 bg-red-100 p-3 rounded-lg">
            <span>⚠️</span>
            <p>Votre formation de maintien des acquis est expirée. L'accès aux stages de spécialité est <strong>bloqué</strong>.</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-xs uppercase font-bold">Heures Formation</p>
          <p className="text-2xl font-bold text-slate-800">42h</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-xs uppercase font-bold">Qualifications</p>
          <p className="text-2xl font-bold text-slate-800">{user.qualifications.length}</p>
        </div>
      </div>

      {/* Next Training */}
      {myNextTraining ? (
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-fire-red">
          <p className="text-xs font-bold text-fire-red uppercase mb-1">Prochaine Convocation</p>
          <h3 className="font-bold text-lg mb-1">{myNextTraining.title}</h3>
          <div className="text-sm text-slate-600 space-y-1">
            <p>📅 {new Date(myNextTraining.date).toLocaleDateString('fr-FR')}</p>
            <p>📍 {myNextTraining.location}</p>
            <p>🥋 Tenue de feu complète</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center py-8">
          <p className="text-slate-400">Aucune formation planifiée.</p>
        </div>
      )}

      {/* AI Coach */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl">🤖</div>
          <div>
            <h3 className="font-bold">Coach Carrière</h3>
            <p className="text-xs text-slate-300">Propulsé par Gemini</p>
          </div>
        </div>
        
        {advice ? (
          <div className="bg-white/10 p-4 rounded-xl text-sm leading-relaxed animate-fade-in">
            "{advice}"
          </div>
        ) : (
          <p className="text-sm text-slate-300 mb-4">
            Besoin d'un conseil pour passer au grade supérieur ou choisir votre prochaine spécialité ?
          </p>
        )}

        {!advice && (
          <button 
            onClick={handleGetCoachAdvice}
            disabled={loadingAdvice}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loadingAdvice ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Analyser mon profil"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
