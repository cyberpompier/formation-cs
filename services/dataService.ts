
import { supabase } from './supabaseClient';
import { User, Training, Rank, TrainingType } from '../types';
import { INITIAL_USERS, INITIAL_TRAININGS } from '../constants';

// --- Local Storage for Demo Mode (when Supabase is missing) ---
let localUsers: User[] = [...INITIAL_USERS];
let localTrainings: Training[] = [...INITIAL_TRAININGS];

export const getDemoUserByEmail = (email: string) => localUsers.find(u => u.email === email);

// --- Mappers : Conversion App (camelCase) <-> DB (snake_case) ---

const mapUserFromDB = (row: any): User => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  rank: row.rank as Rank,
  center: row.center,
  sdis: row.sdis,
  email: row.email,
  phone: row.phone,
  profilePic: row.profile_pic,
  fcesValid: row.fces_valid,
  fcesDate: row.fces_date,
  qualifications: row.qualifications || [],
  isAdmin: row.is_admin,
  isTrainer: row.is_trainer,
});

const mapUserToDB = (user: User) => ({
  id: user.id,
  first_name: user.firstName,
  last_name: user.lastName,
  rank: user.rank,
  center: user.center,
  sdis: user.sdis,
  email: user.email,
  phone: user.phone,
  profile_pic: user.profilePic,
  fces_valid: user.fcesValid,
  fces_date: user.fcesDate,
  qualifications: user.qualifications,
  is_admin: user.isAdmin,
  is_trainer: user.isTrainer,
});

const mapTrainingFromDB = (row: any): Training => ({
  id: row.id,
  title: row.title,
  type: row.type as TrainingType,
  date: row.date,
  startTime: row.start_time,
  durationDays: row.duration_days,
  hoursPerDay: row.hours_per_day,
  location: row.location,
  description: row.description,
  slots: row.slots,
  registeredUserIds: row.registered_user_ids || [],
  prerequisites: row.prerequisites || [],
  image: row.image,
  trainer1: row.trainer1,
  trainer2: row.trainer2,
  isCompleted: row.is_completed,
  presentUserIds: row.present_user_ids || [],
});

const mapTrainingToDB = (t: Training) => ({
  id: t.id,
  title: t.title,
  type: t.type,
  date: t.date,
  start_time: t.startTime,
  duration_days: t.durationDays,
  hours_per_day: t.hoursPerDay,
  location: t.location,
  description: t.description,
  slots: t.slots,
  registered_user_ids: t.registeredUserIds,
  prerequisites: t.prerequisites,
  image: t.image,
  trainer1: t.trainer1,
  trainer2: t.trainer2,
  is_completed: t.isCompleted,
  present_user_ids: t.presentUserIds,
});

// --- API Methods ---

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  if (!supabase) {
    return localUsers.find(u => u.id === userId) || null;
  }
  
  const { data, error } = await supabase
    .from('FIRETRAINED_USERS')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }
  return mapUserFromDB(data);
};

export const fetchUsers = async (): Promise<User[]> => {
  if (!supabase) return localUsers;

  try {
    const { data, error } = await supabase.from('FIRETRAINED_USERS').select('*');
    
    if (error) {
      console.warn('Erreur chargement utilisateurs (utilisation fallback):', error.message);
      return INITIAL_USERS;
    }
    
    return data.map(mapUserFromDB);
  } catch (err) {
    console.error(err);
    return INITIAL_USERS;
  }
};

export const fetchTrainings = async (): Promise<Training[]> => {
  if (!supabase) return localTrainings;

  try {
    const { data, error } = await supabase.from('FIRETRAINED_TRAININGS').select('*');
    
    if (error) {
      console.warn('Erreur chargement formations (utilisation fallback):', error.message);
      return INITIAL_TRAININGS;
    }

    if (!data || data.length === 0) {
      // Auto-seeding pour les formations
      const seeds = INITIAL_TRAININGS.map(mapTrainingToDB);
      const { error: insertError } = await supabase.from('FIRETRAINED_TRAININGS').insert(seeds);
      if (!insertError) return INITIAL_TRAININGS;
    }

    return data.map(mapTrainingFromDB);
  } catch (err) {
    console.error(err);
    return INITIAL_TRAININGS;
  }
};

export const saveUser = async (user: User) => {
  if (!supabase) {
    const idx = localUsers.findIndex(u => u.id === user.id);
    if (idx >= 0) localUsers[idx] = user;
    else localUsers.push(user);
    return;
  }

  const payload = mapUserToDB(user);
  const { error } = await supabase.from('FIRETRAINED_USERS').upsert(payload);
  if (error) console.error('Erreur sauvegarde utilisateur:', error);
};

export const saveTraining = async (training: Training) => {
  if (!supabase) {
    const idx = localTrainings.findIndex(t => t.id === training.id);
    if (idx >= 0) localTrainings[idx] = training;
    else localTrainings.push(training);
    return;
  }

  const payload = mapTrainingToDB(training);
  const { error } = await supabase.from('FIRETRAINED_TRAININGS').upsert(payload);
  if (error) console.error('Erreur sauvegarde formation:', error);
};

export const deleteTraining = async (id: string) => {
  if (!supabase) {
    localTrainings = localTrainings.filter(t => t.id !== id);
    return;
  }

  const { error } = await supabase.from('FIRETRAINED_TRAININGS').delete().eq('id', id);
  if (error) console.error('Erreur suppression formation:', error);
};
