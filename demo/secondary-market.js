// secondary-market.js — offres fictives du marché secondaire NoKo (démo)
// Projets déjà financés (collecte terminée), revendus avant échéance par d'autres investisseurs fictifs.

window.NOKO_MARKET_LISTINGS = [
  {
    id: 'm1',
    projectName: 'Fromagerie des Hauts Plateaux',
    loc: 'Aurillac · Affinage fromager',
    projectType: 'pret', typeLabel: 'Prêt',
    seller: 'Camille V.',
    originalAmount: 50, rate: 9, remainingMonths: 6, totalMonths: 18,
    askPrice: 47,
    scores: { financier: 4, ecologique: 4, social: 4, gouvernance: 4 }
  },
  {
    id: 'm2',
    projectName: 'Atelier Vélo Cargo Urbain',
    loc: 'Bordeaux · Mobilité douce',
    projectType: 'capital', typeLabel: 'Action',
    seller: 'Mehdi R.',
    originalAmount: 100, rate: null, remainingMonths: 30, totalMonths: 60,
    askPrice: 118,
    scores: { financier: 4, ecologique: 5, social: 4, gouvernance: 5 }
  },
  {
    id: 'm3',
    projectName: 'Conserverie Marine Bretonne',
    loc: 'Lorient · Conserverie artisanale',
    projectType: 'pret', typeLabel: 'Prêt',
    seller: 'Inès T.',
    originalAmount: 30, rate: 8, remainingMonths: 4, totalMonths: 20,
    askPrice: 30,
    scores: { financier: 3, ecologique: 3, social: 4, gouvernance: 4 }
  },
  {
    id: 'm4',
    projectName: 'Brasserie Houblon Local',
    loc: 'Lille · Brasserie artisanale',
    projectType: 'pret', typeLabel: 'Prêt',
    seller: 'Antoine D.',
    originalAmount: 80, rate: 9.5, remainingMonths: 10, totalMonths: 24,
    askPrice: 71,
    scores: { financier: 3, ecologique: 3, social: 4, gouvernance: 3 }
  },
  {
    id: 'm5',
    projectName: 'Coopérative Maraîchère du Lot',
    loc: 'Cahors · Agriculture biologique',
    projectType: 'capital', typeLabel: 'Action',
    seller: 'Sophie L.',
    originalAmount: 50, rate: null, remainingMonths: 42, totalMonths: 60,
    askPrice: 62,
    scores: { financier: 4, ecologique: 5, social: 5, gouvernance: 4 }
  },
  {
    id: 'm6',
    projectName: 'Atelier Céramique du Marais',
    loc: 'Vallauris · Artisanat d\'art',
    projectType: 'pret', typeLabel: 'Prêt',
    seller: 'Yanis B.',
    originalAmount: 40, rate: 8.5, remainingMonths: 14, totalMonths: 18,
    askPrice: 33,
    scores: { financier: 3, ecologique: 4, social: 3, gouvernance: 4 }
  },
  {
    id: 'm7',
    projectName: 'Librairie Indépendante Les Lucioles',
    loc: 'Clermont-Ferrand · Librairie',
    projectType: 'pret', typeLabel: 'Prêt',
    seller: 'Claire M.',
    originalAmount: 20, rate: 8, remainingMonths: 7, totalMonths: 16,
    askPrice: 19,
    scores: { financier: 4, ecologique: 3, social: 5, gouvernance: 4 }
  },
  {
    id: 'm8',
    projectName: 'Atelier Réparation Vélos Solidaire',
    loc: 'Grenoble · Économie sociale et solidaire',
    projectType: 'capital', typeLabel: 'Action',
    seller: 'Tom S.',
    originalAmount: 60, rate: null, remainingMonths: 20, totalMonths: 48,
    askPrice: 56,
    scores: { financier: 3, ecologique: 5, social: 5, gouvernance: 4 }
  }
];
