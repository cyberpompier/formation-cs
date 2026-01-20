export enum Rank {
  SAP = 'Sapeur',
  CPL = 'Caporal',
  SCH = 'Sergent-Chef',
  LTN = 'Lieutenant',
  CDT = 'Commandant'
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
  name: string;
  rank: Rank;
  center: string;
  fcesValid: boolean; // Formation de Maintien des Acquis validity
  fcesDate: string; // ISO Date
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
  prerequisites: string[]; // List of qualification codes required
  image?: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
