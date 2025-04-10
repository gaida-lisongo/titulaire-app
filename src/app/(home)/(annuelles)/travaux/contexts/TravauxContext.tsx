import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import TitulaireService from '@/api/titulaireService'
import type { Travail, Question } from '@/types/travail'
import agentService from '@/api/agentService'
import titulaireService from '@/api/titulaireService'

interface TravauxContextType {
  travaux: Travail[]
  isLoading: boolean
  error: string | null
  resolutions: any[]
  searchQuery: string // Ajout de la propriété searchQuery
  setSearchQuery: (query: string) => void // Ajout de la fonction setter
  addTravail: (travail: Omit<Travail, '_id'>) => Promise<void>
  updateTravail: (id: string, updates: Partial<Travail>) => Promise<void>
  deleteTravail: (id: string) => Promise<void>
  addQuestions: (travailId: string, questions: Question[]) => Promise<void>
  updateQuestion: (travailId: string, questionId: string, data: Partial<Question>) => Promise<void>
  loadTravaux: (matiereId: string) => Promise<void>
  saveQuestion: (file: File) => Promise<string>
  getResolutions: (travailId: string) => Promise<any[]>
  makeCote: (data : 
    {
        anneeId: string, 
        etudiantId: string, 
        matiereId: string, 
        createdBy: string,
        noteAnnuel?: number,
        noteExamen?: number,
        noteRattrapage?: number,
    }) => Promise<void>
  makeCorrection: (resolutionId: string, note: any) => Promise<void>
  
}

const TravauxContext = createContext<TravauxContextType | null>(null)

export function TravauxProvider({ children }: { children: ReactNode }) {
  const [travaux, setTravaux] = useState<Travail[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resolutions, setResolutions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('') // Ajout de l'état pour la recherche
  const { agent } = useAuthStore()

  const loadTravaux = useCallback(async (matiereId: string) => {
    if (!agent?.id) return
    
    try {
      setIsLoading(true)
      setError(null)
      const data = await TitulaireService.getAllTravauxByCharge(matiereId, agent.id)
      console.log('Travaux chargés:', data)
      
      // Transformer les données pour correspondre au type Travail
      const transformedData = data.map((item: any) => ({
        _id: item._id,
        titre: item.title || item.titre, // Utiliser title s'il existe, sinon titre
        description: item.description,
        date_fin: item.dateFin || item.date_fin,
        date_created: item.dateDebut || item.date_created,
        matiereId: item.matiereId,
        matiere: item.matiere,
        auteurId: item.auteurId,
        questions: item.questions || [],
        montant: item.montant || 0,
        type: item.type || 'QUESTION',
        statut: item.statut || 'EN ATTENTE',
        isPublished: item.isPublished || false
      }));
      
      setTravaux(transformedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      console.error('Erreur lors du chargement des travaux:', err)
    } finally {
      setIsLoading(false)
    }
  }, [agent?.id])

  const saveQuestion = async (file: File): Promise<string> => {
    const imageUrl = await titulaireService.saveBlob(file, Date.now().toString());
    console.log('Image URL:', imageUrl);
    
    if (imageUrl) {
      return imageUrl;
    } else {
      throw new Error('Erreur lors du téléchargement de l\'image');
    }
  };

  const addTravail = async (newTravail: Omit<Travail, '_id'>) => {
    try {
      setIsLoading(true)
      const data = await TitulaireService.createTravail(newTravail)
      console.log('Travail créé:', data)
      setTravaux(prev => [...prev, data])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateTravail = async (id: string, updates: Partial<Travail>) => {
    try {
      setIsLoading(true)
      const data = await TitulaireService.updateTravail(id, updates)
      console.log('Travail mis à jour:', data)
      setTravaux(prev => 
        prev.map(travail => 
          travail._id === id ? { ...travail, ...data } : travail
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTravail = async (id: string) => {
    try {
      setIsLoading(true)
      await TitulaireService.deleteTravail(id)
      setTravaux(prev => prev.filter(t => t._id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const addQuestions = async (travailId: string, questions: Question[]) => {
    try {
      setIsLoading(true)
      // Create each question sequentially
      for (const question of questions) {
        await TitulaireService.createQuestion(question, travailId)
      }
      // Refresh travail data
      const updatedTravail = await TitulaireService.updateTravail(travailId, {})
      console.log('Questions ajoutées:', updatedTravail)
      setTravaux(prev =>
        prev.map(t =>
          t._id === travailId ? updatedTravail : t
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout des questions')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuestion = async (travailId: string, questionId: string, data: Partial<Question>) => {
    try {
      setIsLoading(true)
      await TitulaireService.updateQuestion(questionId, travailId, data)
      // Refresh travail data to get updated questions
      const updatedTravail = await TitulaireService.updateTravail(travailId, {})
      console.log('Question mise à jour:', updatedTravail)
      setTravaux(prev =>
        prev.map(t =>
          t._id === travailId ? updatedTravail : t
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la question')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const makeCote = async (data: {
    anneeId: string, 
    etudiantId: string, 
    matiereId: string, 
    createdBy: string,
    noteAnnuel?: number,
    noteExamen?: number,
    noteRattrapage?: number,
  }) => {
    try {
      setIsLoading(true)
      const response = await titulaireService.createNoteEtudiant(data)
      console.log('Cote créée:', response)

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la cote')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const makeCorrection = async (resolutionId: string, cote : {note: number, comment: string}) => {
    try {
      setIsLoading(true)
      const response = await titulaireService.updateResolution(resolutionId, cote)
      console.log('Correction créée:', response)

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la correction')
      throw err
    }
    finally {
      setIsLoading(false)
    }
  }

  const getResolutions = async (travailId: string) => {
    try {
      setIsLoading(true)
      const data = await TitulaireService.getResolutionsByTravailId(travailId)
      console.log('Résolutions chargées:', data)
      if (data) {
        setResolutions(data)
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des résolutions')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue = {
    travaux,
    isLoading,
    error,
    resolutions,
    searchQuery,
    setSearchQuery,
    addTravail,
    updateTravail,
    deleteTravail,
    addQuestions,
    updateQuestion,
    loadTravaux,
    saveQuestion,
    getResolutions,
    makeCote,
    makeCorrection
  }
  
  return (
    <TravauxContext.Provider value={contextValue}>
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