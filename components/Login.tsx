import React, { useState } from 'react';
import { Rank, User } from '../types';
import * as authService from '../services/authService';
import * as dataService from '../services/dataService';
import { supabase } from '../services/supabaseClient';
import { INITIAL_USERS } from '../constants';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Champs supplémentaires pour l'inscription
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rank, setRank] = useState<Rank>(Rank.SAP);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // 1. Créer le compte Auth Supabase
        const { user: authUser } = await authService.signUp(email, password);
        
        if (authUser) {
          // 2. Créer le profil dans la table FIRETRAINED_USERS
          const newUser: User = {
            id: authUser.id,
            firstName,
            lastName,
            rank,
            email,
            center: 'À définir',
            sdis: 'À définir',
            phone: '',
            profilePic: '',
            fcesValid: false,
            fcesDate: new Date().toISOString(),
            qualifications: [],
            isAdmin: false,
            isTrainer: false
          };
          
          await dataService.saveUser(newUser);
          onLoginSuccess(newUser);
        }
      } else {
        // Login
        const { user: authUser } = await authService.signIn(email, password);
        if (authUser) {
          const profile = await dataService.fetchUserProfile(authUser.id);
          if (profile) {
            onLoginSuccess(profile);
          } else {
            setError("Profil introuvable pour cet utilisateur.");
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      let errorMessage = err.message || "Une erreur est survenue";
      
      // Traduction des erreurs Supabase courantes
      if (errorMessage.includes("User already registered")) {
        errorMessage = "Cet email possède déjà un compte. Veuillez vous connecter.";
      } else if (errorMessage.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (errorMessage.includes("Password should be at least")) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAutoFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo123'); // Mot de passe fictif pour le mode démo
    setError(null);
  };

  const inputStyle = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-fire-red focus:outline-none bg-slate-50 text-slate-900 font-bold mb-3";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-500 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-fire-red rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg shadow-red-900/50 mb-4">
            🚒
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">FireTrained</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Gestion & Formation SP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase mb-4 border border-red-100">
              ⚠️ {error}
            </div>
          )}

          {isSignUp && (
            <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-4">
              <input
                type="text"
                placeholder="Prénom"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={inputStyle}
              />
              <input
                type="text"
                placeholder="Nom"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={inputStyle}
              />
              <div className="col-span-2">
                <select
                  value={rank}
                  onChange={e => setRank(e.target.value as Rank)}
                  className={inputStyle}
                >
                  {Object.values(Rank).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputStyle}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-fire-red text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Chargement..." : (isSignUp ? "Créer mon compte" : "Se connecter")}
          </button>
        </form>
        
        {/* Section Comptes de Démo (visible seulement si Supabase n'est pas configuré et qu'on est en login) */}
        {!supabase && !isSignUp && (
            <div className="mt-8 pt-6 border-t border-slate-100 animate-in slide-in-from-bottom-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-4">
                    Mode Démo : Choisir un profil
                </p>
                <div className="space-y-2">
                    {INITIAL_USERS.map(u => (
                        <button
                            key={u.id}
                            type="button"
                            onClick={() => handleDemoAutoFill(u.email)}
                            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 text-left flex items-center gap-4 transition-all group active:scale-[0.98]"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg border border-slate-100 group-hover:scale-110 transition-transform">
                                {u.isAdmin ? '👮‍♂️' : u.isTrainer ? '🧑‍🏫' : '🧑‍🚒'}
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-800 uppercase">{u.rank} {u.lastName}</p>
                                <p className="text-[10px] text-slate-400 font-bold">
                                    {u.isAdmin ? 'Administrateur' : u.isTrainer ? 'Formateur' : 'Sapeur'}
                                </p>
                            </div>
                            <div className="ml-auto text-slate-300 group-hover:text-fire-red transition-colors text-xl">
                                ›
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null); // Clear errors when switching modes
            }}
            className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors uppercase tracking-wide"
          >
            {isSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;