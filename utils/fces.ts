
export type FcesStatus = 'VALID' | 'WARNING' | 'EXPIRED';

export const calculateFcesStatus = (lastTrainingDate: string): { status: FcesStatus; message: string; daysRemaining?: number } => {
  const trainingDate = new Date(lastTrainingDate);
  const trainingYear = trainingDate.getFullYear();
  
  // Dans notre application de démonstration, nous considérons que "aujourd'hui" est en 2026.
  // Pour une PWA réelle, on utiliserait new Date().
  const now = new Date('2026-06-15'); // Date de référence simulée au milieu de 2026
  const currentYear = now.getFullYear();
  
  // Date butoir : 31 Décembre de l'année de validité
  // Si recyclé en 2025, valide jusqu'au 31/12/2026
  const expiryDate = new Date(`${trainingYear + 1}-12-31`);
  
  // Calcul du différentiel en jours
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 1. Si la date actuelle dépasse la date d'expiration
  if (diffDays < 0) {
    return {
      status: 'EXPIRED',
      message: 'HORS RANG : Aptitude expirée. Recyclage obligatoire pour intervention.',
    };
  }

  // 2. Si on est à moins de 61 jours (2 mois) de la date butoir
  if (diffDays <= 61) {
    return {
      status: 'WARNING',
      message: `RECYCLAGE PROCHE : Votre aptitude expire dans ${diffDays} jours.`,
      daysRemaining: diffDays
    };
  }

  // 3. Sinon, l'agent est pleinement apte
  return {
    status: 'VALID',
    message: `APTE : Aptitude opérationnelle validée jusqu'au 31/12/${trainingYear + 1}.`,
    daysRemaining: diffDays
  };
};
