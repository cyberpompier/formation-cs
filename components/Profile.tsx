import React from 'react';
import { User } from '../types';

const Profile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-fire-navy rounded-full flex items-center justify-center text-3xl text-white font-bold mb-4 shadow-lg border-4 border-white">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h2 className="text-xl font-bold text-slate-900">{user.rank} {user.name}</h2>
        <p className="text-slate-500">{user.center}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">Portefeuille de Compétences</h3>
        <div className="flex flex-wrap gap-2">
          {user.qualifications.map(q => (
            <span key={q} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold border border-slate-200">
              {q}
            </span>
          ))}
        </div>
      </div>
      
      <button className="w-full text-red-600 font-semibold py-4 text-sm bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
        Déconnexion
      </button>
    </div>
  );
};

export default Profile;
