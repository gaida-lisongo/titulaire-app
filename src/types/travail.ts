export type TravailType = 'QCM' | 'QUESTION' | 'REPONSE'
export type TravailStatus = 'EN ATTENTE' | 'EN COURS' | 'TERMINE'

export interface Question {
  _id?: string
  enonce: string
  type: 'QCM' | 'LIBRE' | 'FICHIER'
  choix?: string[]
  reponse?: string
  url?: string
}

export interface Matiere {
  designation: string
  code: string
}

export interface Travail {
  _id?: string
  titre: string
  description: string
  type: TravailType
  matiereId: string
  matiere?: Matiere
  date_created?: Date
  date_fin: Date
  auteurId: string
  montant: number
  statut: TravailStatus
  questions: Question[]
  createdAt?: Date
  updatedAt?: Date
  nombreQuestions?: number
  isPublished?: boolean
}

export interface Etudiant {
  _id: string
  matricule: string
  nom: string
}

export interface Reponse {
  _id: string
  etudiantId: string
  etudiant: Etudiant
  travailId: string
  dateSubmission: Date
  note?: number
  reponses: {
    questionId: string
    contenu: string
  }[]
}