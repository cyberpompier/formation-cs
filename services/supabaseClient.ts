import { createClient } from '@supabase/supabase-js';

// Configuration avec les clés fournies
const supabaseUrl = "https://cjmppdgvsrvoxdtwggcq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXBwZGd2c3J2b3hkdHdnZ2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MjA2NTMsImV4cCI6MjA2NTE5NjY1M30.ckavE94EhlDHfjZH_p1AasSTbczQTB6o1sqovqSw5e4";

// Si les clés sont absentes, on renvoie null au lieu de faire crasher createClient
// Cela permet à l'application de fonctionner en mode "hors ligne / démo"
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
  console.warn('Supabase credentials missing. App running in local demo mode.');
}