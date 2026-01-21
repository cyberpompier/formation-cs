import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TrainingList from './components/TrainingList';
import CreateTraining from './components/CreateTraining';
import PersonnelList from './components/PersonnelList';
import Profile from './components/Profile';
import { MOCK_CURRENT_USER_ID, INITIAL_USERS, INITIAL_TRAININGS } from './constants';
import { User, Training, ToastMessage, ToastType } from './types';

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const App = () => {
  // State Simulation
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [trainings, setTrainings] = useState<Training[]>(INITIAL_TRAININGS);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const currentUser = users.find(u => u.id === MOCK_CURRENT_USER_ID) || users[0];

  const showToast = (msg: string, type: ToastType) => {
    setToast({ id: Date.now().toString(), message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Actions avec mise à jour fonctionnelle pour garantir la réactivité immédiate
  const handleRegister = (trainingId: string) => {
    setTrainings(prev => prev.map(t => {
      if (t.id === trainingId) {
        // Empêche les inscriptions en double si l'utilisateur clique trop vite
        if (t.registeredUserIds.includes(currentUser.id)) return t;
        return { ...t, registeredUserIds: [...t.registeredUserIds, currentUser.id] };
      }
      return t;
    }));
    showToast('Inscription validée !', 'success');
  };

  const handleUnregister = (trainingId: string) => {
    setTrainings(prev => prev.map(t => {
      if (t.id === trainingId) {
        return { ...t, registeredUserIds: t.registeredUserIds.filter(id => id !== currentUser.id) };
      }
      return t;
    }));
    showToast('Désinscription prise en compte.', 'info');
  };

  const handleCreateTraining = (data: Partial<Training>) => {
    const newTraining: Training = {
      ...data as Training,
      id: `t${Date.now()}`,
      registeredUserIds: data.registeredUserIds || [],
      prerequisites: data.prerequisites || [],
      image: data.image,
      isCompleted: false 
    };
    setTrainings(prev => [...prev, newTraining]);
    showToast('Formation publiée avec succès', 'success');
  };

  const handleToggleFCES = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, fcesValid: !u.fcesValid };
      }
      return u;
    }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    showToast('Profil mis à jour !', 'success');
  };

  const handleLogout = () => {
    showToast('Déconnexion réussie.', 'info');
  };

  const handleValidateTraining = (trainingId: string) => {
    setTrainings(prev => prev.map(t => {
      if (t.id === trainingId) {
        return { ...t, isCompleted: true };
      }
      return t;
    }));
    showToast('Formation validée avec succès !', 'success');
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard user={currentUser} trainings={trainings} />} />
          <Route 
            path="trainings" 
            element={
              <TrainingList 
                trainings={trainings} 
                user={currentUser} 
                allUsers={users} 
                onRegister={handleRegister} 
                onUnregister={handleUnregister}
                onValidateTraining={handleValidateTraining}
              />
            } 
          />
          <Route 
            path="create" 
            element={currentUser.isTrainer ? <CreateTraining onCreate={handleCreateTraining} /> : <Navigate to="/" />} 
          />
          <Route 
            path="personnel" 
            element={currentUser.isAdmin ? <PersonnelList users={users} onToggleFCES={handleToggleFCES} /> : <Navigate to="/" />} 
          />
          <Route path="profile" element={<Profile user={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />} />
        </Route>
      </Routes>

      {/* Global Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl font-black text-xs uppercase tracking-widest text-white animate-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-fire-red' : 'bg-slate-900'
        }`}>
          {toast.message}
        </div>
      )}
    </HashRouter>
  );
};

export default App;