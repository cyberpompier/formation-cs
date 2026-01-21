

import { Rank, Training, TrainingType, User } from './types';

export const MOCK_CURRENT_USER_ID = 'u2'; 

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    firstName: 'Jean',
    lastName: 'Dupont',
    rank: Rank.CPL,
    center: 'CS Paris-Sud',
    sdis: 'SDIS 75',
    email: 'jean.dupont@sdis75.fr',
    phone: '0612345678',
    profilePic: '',
    fcesValid: true,
    fcesDate: '2025-05-15', // RECYCLÉ en 2025 -> APTE tout 2026 (Warning seulement en Nov/Déc 2026)
    qualifications: ['PSE1', 'PSE2', 'INC1', 'CRAP1'],
    isAdmin: false,
    isTrainer: false
  },
  {
    id: 'u2',
    firstName: 'Marie',
    lastName: 'Curie',
    rank: Rank.LTN,
    center: 'CS Lyon',
    sdis: 'SDIS 69',
    email: 'marie.curie@sdis69.fr',
    phone: '0798765432',
    profilePic: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFhgfFhgYJhIfJsgmMjIuNSo2OTtWSjZJbHNtZ2tYYSxMd5rQ4OjT4XzYFOTxMhMfKSEwKykPFSyYvL+y27//2wBDAd/mJTMtMTtmY2x+g4QoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/ABEIAAoACgMBIgACEQEDEQH/xAAZAAEBAQEBAAAAAAAAAAAAAAADAgEFB//EABwQAQEAAwEBAQAAAAAAAAAAAAADAAECBCExA//aAAgBAAQBAp6jvsaO7Q//EABcAAwEAAAAAAAAAAAAAAAAAAAIDBP/aAAgBAgABBQJq7Xm0tXJ4X//EABkRAQACAwAAAAAAAAAAAAAAAAABABARQP/aAAgBAxAREwGK9aH/xAAXEQADAQAAAAAAAAAAAAAAAAAAARBC/9oACAECEQE/AasS//xAAZEAEAAgMAAAAAAAAAAAAAAAABABFBUf/aAAgBAgETPwD5t3s//8QAHBABAAIDAQEBAAAAAAAAAAAAAQACEQIxAyFh/9oACAEBAAE/B9DytJ/U5L2q2Xg6H/2Q=',
    fcesValid: true,
    fcesDate: '2026-02-10', // RECYCLÉ en 2026 -> APTE tout 2026 et 2027
    qualifications: ['PSE2', 'FDF3', 'GOC3', 'INC2', 'COD1'],
    isAdmin: true,
    isTrainer: true
  },
  {
    id: 'u3',
    firstName: 'Paul',
    lastName: 'Durand',
    rank: Rank.SAP,
    center: 'CS Paris-Sud',
    sdis: 'SDIS 75',
    email: 'paul.durand@sdis75.fr',
    phone: '0699887766',
    profilePic: '',
    fcesValid: false,
    fcesDate: '2024-11-10', // RECYCLÉ en 2024 -> EXPIRÉ (HORS RANG) pour l'année 2026
    qualifications: ['PSE1', 'TOP'],
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
    startTime: '08:00',
    durationDays: 1,
    hoursPerDay: 7,
    location: 'Centre de Formation Dpt',
    description: 'Recyclage obligatoire des acquis en secourisme. Ateliers pratiques et mises en situation pour maintenir vos compétences à jour.',
    slots: 12,
    registeredUserIds: ['u2'],
    prerequisites: ['PSE1'],
    image: 'https://picsum.photos/400/200?random=1',
    trainer1: 'Cpt. Leblanc',
    trainer2: 'Adj. Dubois'
  },
  {
    id: 't2',
    title: 'Perfectionnement Incendie Urbain',
    type: TrainingType.INC,
    date: '2026-07-02',
    startTime: '09:00',
    durationDays: 3,
    hoursPerDay: 6,
    location: 'Caisson à feu - Zone Nord',
    description: 'Stage intensif sur les techniques de lance et lecture du feu en milieu clos. Développez votre maîtrise opérationnelle.',
    slots: 6,
    registeredUserIds: ['u1'],
    prerequisites: ['INC1', 'CRAP1'],
    image: 'https://picsum.photos/400/200?random=2',
    trainer1: 'Lt. Martin'
  },
  {
    id: 't3',
    title: 'Conduite Tout-Terrain (COD2)',
    type: TrainingType.COND,
    date: '2026-08-10',
    startTime: '07:30',
    durationDays: 2,
    hoursPerDay: 8,
    location: 'Piste Forestière',
    description: 'Formation à la conduite des VLHR et CCF en terrain accidenté. Maîtrisez les véhicules d\'intervention hors-route.',
    slots: 4,
    registeredUserIds: ['u3'],
    prerequisites: ['COD1', 'Permis B'],
    image: 'https://picsum.photos/400/200?random=3',
    trainer1: 'Sgt. Perez',
  }
];
