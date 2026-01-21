
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TrainingList from './components/TrainingList';
import CreateTraining from './components/CreateTraining';
import PersonnelList from './components/PersonnelList';
import Profile from './components/Profile';
import Login from './components/Login';
import { User, Training, ToastMessage, ToastType } from './types';
import * as dataService from './services/dataService';
import * as authService from './services/authService';
import { supabase } from './services/supabaseClient';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  
  const [authChecking, setAuthChecking] = useState(true); // Initial auth check
  const [dataLoading, setDataLoading] = useState(false);
  
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // 1. Initial Auth Check & Session Listener
  useEffect(() => {
    const initAuth = async () => {
      setAuthChecking(true);
      
      // Check current session
      const session = await authService.getSession();
      
      if (session?.user) {
        // Fetch User Profile
        const profile = await dataService.fetchUserProfile(session.user.id);
        if (profile) {
          setCurrentUser(profile);
          // Load global data only if authenticated
          loadGlobalData();
        } else {
          // Auth exists but no profile? (Edge case)
          console.warn("Auth session exists but no profile found.");
        }
      }
      setAuthChecking(false);
    };

    initAuth();

    // Listener for Auth Changes (SignOut, etc)
    const { data: { subscription } } = supabase 
      ? supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
            setUsers([]);
            setTrainings([]);
          }
        })
      : { data: { subscription: { unsubscribe: () => {} } } };

    return () => subscription.unsubscribe();
  }, []);

  const loadGlobalData = async () => {
    setDataLoading(true);
    try {
      const [fetchedUsers, fetchedTrainings] = await Promise.all([
        dataService.fetchUsers(),
        dataService.fetchTrainings()
      ]);
      setUsers(fetchedUsers);
      setTrainings(fetchedTrainings);
    } catch (error) {
      console.error("Failed to load global data", error);
    } finally {
      setDataLoading(false);
    }
  };

  const showToast = (msg: string, type: ToastType) => {
    setToast({ id: Date.now().toString(), message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Called from Login Component upon successful sign in/up
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    loadGlobalData();
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    showToast('Déconnexion réussie.', 'info');
  };

  // --- Handlers (Existing Logic) ---

  const handleRegister = async (trainingId: string) => {
    if (!currentUser) return;
    const trainingToUpdate = trainings.find(t => t.id === trainingId);
    if (!trainingToUpdate || trainingToUpdate.registeredUserIds.includes(currentUser.id)) return;
    const updatedTraining = { 
      ...trainingToUpdate, 
      registeredUserIds: [...trainingToUpdate.registeredUserIds, currentUser.id] 
    };
    setTrainings(prev => prev.map(t => t.id === trainingId ? updatedTraining : t));
    await dataService.saveTraining(updatedTraining);
    showToast('Inscription validée !', 'success');
  };

  const handleUnregister = async (trainingId: string) => {
    if (!currentUser) return;
    const trainingToUpdate = trainings.find(t => t.id === trainingId);
    if (!trainingToUpdate) return;
    const updatedTraining = { 
      ...trainingToUpdate, 
      registeredUserIds: trainingToUpdate.registeredUserIds.filter(id => id !== currentUser.id) 
    };
    setTrainings(prev => prev.map(t => t.id === trainingId ? updatedTraining : t));
    await dataService.saveTraining(updatedTraining);
    showToast('Désinscription prise en compte.', 'info');
  };

  const handleCreateTraining = async (data: Partial<Training>) => {
    const newTraining: Training = {
      ...data as Training,
      id: `t${Date.now()}`,
      registeredUserIds: data.registeredUserIds || [],
      prerequisites: data.prerequisites || [],
      image: data.image,
      isCompleted: false 
    };
    setTrainings(prev => [...prev, newTraining]);
    await dataService.saveTraining(newTraining);
    showToast('Formation publiée avec succès', 'success');
  };

  const handleEditTraining = async (updatedTraining: Training) => {
    setTrainings(prev => prev.map(t => t.id === updatedTraining.id ? updatedTraining : t));
    await dataService.saveTraining(updatedTraining);
    showToast('Modification enregistrée', 'success');
  };

  const handleDeleteTraining = async (trainingId: string) => {
    setTrainings(prev => prev.filter(t => t.id !== trainingId));
    await dataService.deleteTraining(trainingId);
    showToast('Formation supprimée définitivement', 'info');
  };

  const handleToggleFCES = async (userId: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;
    const updatedUser = { ...userToUpdate, fcesValid: !userToUpdate.fcesValid };
    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    await dataService.saveUser(updatedUser);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser); // Update local state too if it's the current user
    await dataService.saveUser(updatedUser);
    showToast('Profil mis à jour !', 'success');
  };

  const handleValidateTraining = async (trainingId: string) => {
    const trainingToUpdate = trainings.find(t => t.id === trainingId);
    if (!trainingToUpdate) return;
    const updatedTraining = { ...trainingToUpdate, isCompleted: true };
    setTrainings(prev => prev.map(t => t.id === trainingId ? updatedTraining : t));
    await dataService.saveTraining(updatedTraining);
    showToast('Formation validée avec succès !', 'success');
  };

  // --- Rendering ---

  if (authChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 flex-col gap-4">
        <div className="w-16 h-16 border-4 border-fire-red border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white font-black uppercase tracking-widest text-sm animate-pulse">Initialisation...</div>
      </div>
    );
  }

  // Si pas connecté, afficher Login
  if (!currentUser) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        {/* Helper pour le mode Demo si Supabase n'est pas configuré */}
        {!supabase && (
            <div className="fixed bottom-4 left-0 w-full text-center text-white text-xs opacity-50 pointer-events-none">
              Mode Démo (Supabase non détecté)
            </div>
        )}
      </>
    );
  }

  if (dataLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 flex-col gap-4">
        <div className="w-16 h-16 border-4 border-fire-red border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white font-black uppercase tracking-widest text-sm animate-pulse">Chargement des données...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout currentUser={currentUser} />}>
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
                onEditTraining={handleEditTraining}
                onDeleteTraining={handleDeleteTraining}
              />
            } 
          />
          <Route 
            path="create" 
            element={(currentUser.isTrainer || currentUser.isAdmin) ? <CreateTraining onCreate={handleCreateTraining} /> : <Navigate to="/" />} 
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
