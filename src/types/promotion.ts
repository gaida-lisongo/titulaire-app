export interface PromotionInput {
  sectionId: string;    // Obligatoire
  niveau: string;       // Obligatoire
  mention: string;      // Obligatoire
  orientation: string;  // Obligatoire
  description?: string;
  statut?: 'ACTIF' | 'INACTIF';
}

export interface Promotion {
  _id: string;
  sectionId: string;
  niveau: string;
  mention: string;
  orientation: string;
  description: string;
  statut: 'ACTIF' | 'INACTIF';
  unites: Unite[];
}

interface Unite {
  _id: string;
  code: string;
  designation: string;
  categorie: string;
  matieres?: string[];
}

export interface PromotionsResponse {
  success: boolean;
  data: Promotion[];
  message: string;
}