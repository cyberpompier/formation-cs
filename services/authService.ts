import { supabase } from './supabaseClient';
import { getDemoUserByEmail } from './dataService';

export const signIn = async (email: string, pass: string) => {
  if (!supabase) {
    // Mock Authentication for Demo Mode
    const user = getDemoUserByEmail(email);
    if (!user) {
        throw new Error("Utilisateur introuvable. En mode démo, utilisez: marie.curie@sdis69.fr");
    }
    return { user: { id: user.id, email: user.email } };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, pass: string) => {
  if (!supabase) {
    // Mock Signup for Demo Mode
    if (getDemoUserByEmail(email)) {
        throw new Error("Cet utilisateur existe déjà (Mode Démo).");
    }
    return { user: { id: `demo-${Date.now()}`, email } };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) return; // Nothing to do in demo mode (client-side state is cleared in App.tsx)
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
};