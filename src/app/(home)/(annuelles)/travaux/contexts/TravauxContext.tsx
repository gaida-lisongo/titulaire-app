import { createContext, useContext, useState, ReactNode } from 'react'
import { Travail, Question } from '@/types/travail'

interface TravauxContextType {
  travaux: Travail[]
  addTravail: (travail: Omit<Travail, '_id'>) => void
  updateTravail: (id: string, updates: Partial<Travail>) => void
  publishTravail: (id: string) => Promise<void>
  addQuestions: (travailId: string, questions: Question[]) => void
}

const mockTravaux: Travail[] = [
  {
    _id: '1',
    titre: 'Devoir de Programmation',
    description: 'Créer une API REST avec Node.js',
    matiereId: 'info101',
    date_fin: new Date('2024-05-01'),
    auteurId: 'prof1',
    montant: 20,
    statut: 'EN ATTENTE',
    questions: [],
    isPublished: false
  }
]

const TravauxContext = createContext<TravauxContextType | null>(null)

export function TravauxProvider({ children }: { children: ReactNode }) {
  const [travaux, setTravaux] = useState<Travail[]>(mockTravaux)

  const addTravail = (newTravail: Omit<Travail, '_id'>) => {
    const travail: Travail = {
      ...newTravail,
      _id: crypto.randomUUID(),
      date_created: new Date(),
      questions: []
    }
    setTravaux(prev => [...prev, travail])
  }

  const updateTravail = (id: string, updates: Partial<Travail>) => {
    setTravaux(prev => 
      prev.map(travail => 
        travail._id === id ? { ...travail, ...updates } : travail
      )
    )
  }

  const addQuestions = (travailId: string, questions: Question[]) => {
    setTravaux(prev =>
      prev.map(travail =>
        travail._id === travailId
          ? {
              ...travail,
              questions: questions.map(q => ({
                ...q,
                _id: crypto.randomUUID()
              }))
            }
          : travail
      )
    )
  }

  const publishTravail = async (id: string) => {
    const travail = travaux.find(t => t._id === id)
    if (!travail) return

    try {
      // TODO: Appel API pour publier le travail
      // const response = await fetch('/api/travaux', {
      //   method: 'POST',
      //   body: JSON.stringify(travail)
      // })
      
      setTravaux(prev =>
        prev.map(t =>
          t._id === id ? { ...t, isPublished: true } : t
        )
      )
    } catch (error) {
      console.error('Erreur lors de la publication:', error)
      throw error
    }
  }

  return (
    <TravauxContext.Provider 
      value={{ 
        travaux, 
        addTravail, 
        updateTravail,
        publishTravail,
        addQuestions
      }}
    >
      {children}
    </TravauxContext.Provider>
  )
}

export function useTravauxContext() {
  const context = useContext(TravauxContext)
  if (!context) {
    throw new Error('useTravauxContext must be used within TravauxProvider')
  }
  return context
}