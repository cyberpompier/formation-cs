
import React, { useState } from 'react';
import { User } from '../types';
import StaffProfileModal from './StaffProfileModal';
import { calculateFcesStatus } from '../utils/fces';

interface PersonnelListProps {
  users: User[];
  onToggleFCES: (userId: string) => void;
}

const PersonnelList: React.FC<PersonnelListProps> = ({ users, onToggleFCES }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const sortedUsers = [...users].sort((a, b) => {
    const statusA = calculateFcesStatus(a.fcesDate).status;
    const statusB = calculateFcesStatus(b.fcesDate).status;
    if (statusA === statusB) return a.lastName.localeCompare(b.lastName);
    if (statusA === 'EXPIRED') return -1;
    if (statusB === 'EXPIRED') return 1;
    return statusA === 'WARNING' ? -1 : 1;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">Effectif Opérationnel</h3>
          <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">{users.length} Agents</span>
        </div>
        <ul className="divide-y divide-slate-50">
          {sortedUsers.map((u) => {
            const fces = calculateFcesStatus(u.fcesDate);
            return (
              <li 
                key={u.id} 
                className="p-5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer group"
                onClick={() => setSelectedUser(u)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg group-hover:rotate-3 transition-transform">
                    {u.profilePic ? (
                      <img src={u.profilePic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(u.firstName, u.lastName)
                    )}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase italic leading-none mb-1 text-sm">{u.rank} {u.lastName}</p>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${
                         fces.status === 'VALID' ? 'bg-green-500' : fces.status === 'WARNING' ? 'bg-orange-500' : 'bg-red-500'
                       }`}></span>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                         FCES {new Date(u.fcesDate).getFullYear()}
                       </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
                    fces.status === 'VALID' ? 'bg-green-100 text-green-700' : fces.status === 'WARNING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {fces.status === 'VALID' ? 'OK' : fces.status === 'WARNING' ? 'À RECYCLER' : 'EXPIRÉ'}
                  </div>
                  <span className="text-slate-300 group-hover:translate-x-1 transition-transform">›</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {selectedUser && (
        <StaffProfileModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default PersonnelList;
