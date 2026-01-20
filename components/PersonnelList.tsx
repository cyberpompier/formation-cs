import React from 'react';
import { User } from '../types';

interface PersonnelListProps {
  users: User[];
  onToggleFCES: (userId: string) => void;
}

const PersonnelList: React.FC<PersonnelListProps> = ({ users, onToggleFCES }) => {
  // Sort: Invalid FCES first, then by name
  const sortedUsers = [...users].sort((a, b) => {
    if (a.fcesValid === b.fcesValid) return a.name.localeCompare(b.name);
    return a.fcesValid ? 1 : -1;
  });

  const kpiTotal = users.length;
  const kpiInvalid = users.filter(u => !u.fcesValid).length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
          <p className="text-2xl font-bold text-slate-800">{kpiTotal}</p>
          <p className="text-xs font-bold text-slate-400 uppercase">Effectif Total</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
          {kpiInvalid > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse m-2"></div>}
          <p className="text-2xl font-bold text-red-600">{kpiInvalid}</p>
          <p className="text-xs font-bold text-slate-400 uppercase">Défaut FCES</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h3 className="font-bold text-slate-700">Annuaire</h3>
        </div>
        <ul>
          {sortedUsers.map((u) => (
            <li key={u.id} className="p-4 border-b border-slate-50 last:border-0 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">{u.rank} {u.name}</p>
                <p className="text-xs text-slate-500">{u.center} • {u.qualifications.length} Qualifs</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[10px] font-bold uppercase text-slate-400">FCES</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={u.fcesValid} 
                      onChange={() => onToggleFCES(u.id)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                  </div>
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PersonnelList;
