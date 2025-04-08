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

export interface Travail {
  _id?: string
  titre: string
  description: string
  type: TravailType
  matiereId: string
  date_created?: Date
  date_fin: Date
  auteurId: string
  montant: number
  statut: TravailStatus
  questions: Question[]
  nombreQuestions?: number
  isPublished?: boolean
}