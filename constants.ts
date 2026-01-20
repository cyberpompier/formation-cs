import { Rank, Training, TrainingType, User } from './types';

export const MOCK_CURRENT_USER_ID = 'u1';

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Jean Dupont',
    rank: Rank.CPL,
    center: 'CS Paris-Sud',
    fcesValid: true,
    fcesDate: '2023-10-15',
    qualifications: ['PSE1', 'PSE2', 'INC1'],
    isAdmin: false,
    isTrainer: false
  },
  {
    id: 'u2',
    name: 'Marie Curie',
    rank: Rank.LTN,
    center: 'CS Lyon',
    fcesValid: true,
    fcesDate: '2024-01-20',
    qualifications: ['PSE2', 'FDF3', 'GOC3'],
    isAdmin: true,
    isTrainer: true
  },
  {
    id: 'u3',
    name: 'Paul Durand',
    rank: Rank.SAP,
    center: 'CS Paris-Sud',
    fcesValid: false,
    fcesDate: '2022-05-10', // Expired
    qualifications: ['PSE1'],
    isAdmin: false,
    isTrainer: false
  }
];

export const INITIAL_TRAININGS: Training[] = [
  {
    id: 't1',
    title: 'FMA Secourisme Annuelle',
    type: TrainingType.SUAP,
    date: '2026-06-15',
    location: 'Centre de Formation Dpt',
    description: 'Recyclage obligatoire des acquis en secourisme. Ateliers pratiques et mises en situation.',
    slots: 12,
    registeredUserIds: ['u2'],
    prerequisites: ['PSE1'],
    image: 'https://picsum.photos/400/200?random=1'
  },
  {
    id: 't2',
    title: 'Perfectionnement Incendie Urbain',
    type: TrainingType.INC,
    date: '2026-07-02',
    location: 'Caisson à feu - Zone Nord',
    description: 'Stage intensif sur les techniques de lance et lecture du feu en milieu clos.',
    slots: 6,
    registeredUserIds: ['u1'],
    prerequisites: ['INC1'],
    image: 'https://picsum.photos/400/200?random=2'
  },
  {
    id: 't3',
    title: 'Conduite Tout-Terrain (COD2)',
    type: TrainingType.COND,
    date: '2026-08-10',
    location: 'Piste Forestière',
    description: 'Formation à la conduite des VLHR et CCF en terrain accidenté.',
    slots: 4,
    registeredUserIds: ['u3'],
    prerequisites: ['COD1'],
    image: 'https://picsum.photos/400/200?random=3'
  }
];
