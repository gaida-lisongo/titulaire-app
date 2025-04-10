import { Calendar, Clock, Book, Users } from 'lucide-react'
import type { Travail } from '@/types/travail'

interface ResolutionHeaderProps {
  travail: Travail
  resolutionsCount?: number
}

export function ResolutionHeader({ travail, resolutionsCount = 0 }: ResolutionHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{travail.titre}</h1>
          <p className="text-gray-600 mt-2 mb-4">{travail.description}</p>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Date limite: {new Date(travail.date_fin).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Book className="w-4 h-4" />
              <span>Type: {travail.type}</span>
            </div>
            
            {travail.questions && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{travail.questions.length} question(s)</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{resolutionsCount} soumission(s)</span>
            </div>
          </div>
        </div>
        
        <div>
          <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
            travail.statut === 'EN ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
            travail.statut === 'EN COURS' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {travail.statut}
          </span>
        </div>
      </div>
    </div>
  )
}

// Fonction de notation
const handleNoter = async (note: number, comment: string, resolutionId: string) => {
  try {
    setIsLoading(true)
    // Appeler l'API pour enregistrer la note
    await TitulaireService.setCoteResolution(resolutionId, { 
      note, 
      comment 
    })
    
    // Mettre à jour l'état local
    setResolutions(prev => 
      prev.map(res => 
        res._id === resolutionId 
          ? { ...res, note, commentaire: comment } 
          : res
      )
    )
    
    // Fermer la modal
    setIsModalOpen(false)
    setSelectedStudent(null)
  } catch (error) {
    console.error('Erreur lors de la notation:', error)
  } finally {
    setIsLoading(false)
  }
}