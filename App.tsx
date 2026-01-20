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

  // Actions
  const handleRegister = (trainingId: string) => {
    setTrainings(prev => prev.map(t => {
      if (t.id === trainingId) {
        return { ...t, registeredUserIds: [...t.registeredUserIds, currentUser.id] };
      }
      return t;
    }));
    showToast('Inscription validée !', 'success');
  };

  const handleUnregister = (trainingId: string) => {
    // Rule: Cannot unregister less than 48h before (Simplified check here, assume valid for demo)
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
      // Ensure default values for arrays if not provided by form
      registeredUserIds: data.registeredUserIds || [],
      prerequisites: data.prerequisites || [],
      // Ensure image is set, if not provided by form, a default will be used in CreateTraining
      image: data.image,
      isCompleted: false // New trainings are not completed by default
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
    // In a real app, this would clear authentication tokens and redirect to a login page.
    // For this mock app, we'll just show a toast.
    showToast('Déconnexion réussie.', 'info');
    // Optionally: set MOCK_CURRENT_USER_ID to null or redirect
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
                onValidateTraining={handleValidateTraining} // Pass new prop
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
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-full shadow-xl font-semibold text-white animate-bounce-in ${
          toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
        }`}>
          {toast.message}
        </div>
      )}
    </HashRouter>
  );
};

export default App;