export enum Rank {
  SAP = 'Sapeur',
  S1C = 'Sapeur 1ère Classe',
  CPL = 'Caporal',
  CCH = 'Caporal-Chef',
  SGT = 'Sergent',
  SCH = 'Sergent-Chef',
  ADJ = 'Adjudant',
  ADC = 'Adjudant-Chef',
  LTN = 'Lieutenant',
  CPT = 'Capitaine',
  CDT = 'Commandant',
  LCL = 'Lieutenant-Colonel',
  COL = 'Colonel',
  CGL = 'Contrôleur Général'
}

export enum TrainingType {
  INC = 'Incendie',
  SUAP = 'Secourisme',
  DIV = 'Divers / Spé',
  SPORT = 'Sport',
  COND = 'Conduite'
}

export interface User {
  id: string;
  firstName: string; // Changed from 'name'
  lastName: string;  // Changed from 'name'
  rank: Rank;
  center: string;
  sdis: string;
  email: string;
  phone: string;
  profilePic: string;
  fcesValid: boolean;
  fcesDate: string;
  qualifications: string[];
  isAdmin: boolean;
  isTrainer: boolean;
}

export interface Training {
  id: string;
  title: string;
  type: TrainingType;
  date: string;
  location: string;
  description: string;
  slots: number;
  registeredUserIds: string[];
  prerequisites: string[];
  image?: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// The 'window.aistudio' object and its methods are assumed to be pre-configured, valid, and accessible
// in the execution context where the API client is initialized.
// If an 'AIStudio' type is globally defined by the environment, explicitly redeclaring it here
// causes a conflict. Removing this declaration allows TypeScript to correctly infer the existing global type.
export const ALL_QUALIFICATIONS = [
  'PSE1', 'PSE2', 'CRAP1', 'CRAP2', 'INC1', 'INC2', 'FDF1', 'FDF2', 'GOC1', 'GOC2', 'GOC3',
  'COD1', 'COD2', 'COD3', 'TOP', 'SAP', 'LOG'
];