import { Rank, Training, TrainingType, User } from './types';

export const MOCK_CURRENT_USER_ID = 'u2'; // Changed from 'u1' to 'u2' (Marie Curie, who is isAdmin: true)

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    firstName: 'Jean', // Changed from 'name'
    lastName: 'Dupont',  // Changed from 'name'
    rank: Rank.CPL,
    center: 'CS Paris-Sud',
    sdis: 'SDIS 75',
    email: 'jean.dupont@sdis75.fr',
    phone: '0612345678',
    profilePic: '', // Placeholder, or generate initials
    fcesValid: true,
    fcesDate: '2023-10-15',
    qualifications: ['PSE1', 'PSE2', 'INC1', 'CRAP1'],
    isAdmin: false,
    isTrainer: false
  },
  {
    id: 'u2',
    firstName: 'Marie', // Changed from 'name'
    lastName: 'Curie',  // Changed from 'name'
    rank: Rank.LTN,
    center: 'CS Lyon',
    sdis: 'SDIS 69',
    email: 'marie.curie@sdis69.fr',
    phone: '0798765432',
    profilePic: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFhgfFhgYJhIfJsgmMjIuNSo2OTtWSjZJbHNtZ2tYYSxMd5rQ4OjT4XzYFOTxMhMfKSEwKykPFSyYvL+y27//2wBDAd/mJTMtMTtmY2x+g4QoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wABEIAAoACgMBIgACEQEDEQH/xAAZAAEBAQEBAAAAAAAAAAAAAAADAgEFB//EABwQAQEAAwEBAQAAAAAAAAAAAAADAAECBCExA//aAAgBAAQBAp6jvsaO7Q//EABcAAwEAAAAAAAAAAAAAAAAAAAIDBP/aAAgBAgABBQJq7Xm0tXJ4X//EABkRAQACAwAAAAAAAAAAAAAAAAABABARQP/aAAgBAxAREwGK9aH/xAAXEQADAQAAAAAAAAAAAAAAAAAAARBC/9oACAECEQE/AasS//xAAZEAEAAgMAAAAAAAAAAAAAAAABABFBUf/aAAgBAgETPwD5t3s//8QAHBABAAIDAQEBAAAAAAAAAAAAAQACEQIxAyFh/9oACAEBAAE/B9DytJ/U5L2q2Xg6H/2Q=',
    fcesValid: true,
    fcesDate: '2024-01-20',
    qualifications: ['PSE2', 'FDF3', 'GOC3', 'INC2', 'COD1'],
    isAdmin: true,
    isTrainer: true
  },
  {
    id: 'u3',
    firstName: 'Paul', // Changed from 'name'
    lastName: 'Durand',  // Changed from 'name'
    rank: Rank.SAP,
    center: 'CS Paris-Sud',
    sdis: 'SDIS 75',
    email: 'paul.durand@sdis75.fr',
    phone: '0699887766',
    profilePic: '',
    fcesValid: false,
    fcesDate: '2022-05-10', // Expired
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
    startTime: '08:00', // Added
    durationDays: 1, // Added
    location: 'Centre de Formation Dpt',
    description: 'Recyclage obligatoire des acquis en secourisme. Ateliers pratiques et mises en situation pour maintenir vos compétences à jour.',
    slots: 12,
    registeredUserIds: ['u2'],
    prerequisites: ['PSE1'],
    image: 'https://picsum.photos/400/200?random=1',
    trainer1: 'Cpt. Leblanc', // Added
    trainer2: 'Adj. Dubois' // Added
  },
  {
    id: 't2',
    title: 'Perfectionnement Incendie Urbain',
    type: TrainingType.INC,
    date: '2026-07-02',
    startTime: '09:00', // Added
    durationDays: 3, // Added
    location: 'Caisson à feu - Zone Nord',
    description: 'Stage intensif sur les techniques de lance et lecture du feu en milieu clos. Développez votre maîtrise opérationnelle.',
    slots: 6,
    registeredUserIds: ['u1'],
    prerequisites: ['INC1', 'CRAP1'],
    image: 'https://picsum.photos/400/200?random=2',
    trainer1: 'Lt. Martin' // Added
  },
  {
    id: 't3',
    title: 'Conduite Tout-Terrain (COD2)',
    type: TrainingType.COND,
    date: '2026-08-10',
    startTime: '07:30', // Added
    durationDays: 2, // Added
    location: 'Piste Forestière',
    description: 'Formation à la conduite des VLHR et CCF en terrain accidenté. Maîtrisez les véhicules d\'intervention hors-route.',
    slots: 4,
    registeredUserIds: ['u3'],
    prerequisites: ['COD1', 'Permis B'], // Added 'Permis B' for realism
    image: 'https://picsum.photos/400/200?random=3',
    trainer1: 'Sgt. Perez', // Added
  },
  {
    id: 't4',
    title: 'Sauvetage Déblaiement - Équipe Légère',
    type: TrainingType.DIV,
    date: '2026-09-01',
    startTime: '08:30',
    durationDays: 5,
    location: 'Site d\'entraînement SD',
    description: 'Apprentissage des techniques de sauvetage et déblaiement en équipe légère. Essentiel pour les interventions complexes.',
    slots: 8,
    registeredUserIds: [],
    prerequisites: ['PSE2', 'CRAP2'],
    image: 'https://picsum.photos/400/200?random=4',
    trainer1: 'Cdt. Rousseau',
    trainer2: 'Sch. Lambert'
  },
  {
    id: 't5',
    title: 'Préparation Physique Opérationnelle',
    type: TrainingType.SPORT,
    date: '2026-10-20',
    startTime: '14:00',
    durationDays: 1,
    location: 'Complexe sportif caserne',
    description: 'Optimisation de la condition physique pour l\'intervention. Séances pratiques et conseils personnalisés.',
    slots: 20,
    registeredUserIds: ['u1', 'u3'],
    prerequisites: [],
    image: 'https://picsum.photos/400/200?random=5',
    trainer1: 'Sgt. Morel'
  },
];