import { Edit, Trash, Users, Calendar, Clock, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/utils/formatDate' 
import { useTravauxContext } from '../../contexts/TravauxContext'
import type { Travail } from '@/types/travail'

interface TravailCardProps {
  travail: Travail
  onEdit: () => void
  anneeId?: string
}

export function TravailCard({ travail, onEdit, anneeId }: TravailCardProps) {
  const router = useRouter()
  const { deleteTravail } = useTravauxContext()
  const [isDeleting, setIsDeleting] = useState(false)
  const { updateTravail } = useTravauxContext()

  const handleViewResolutions = () => {
    if (!travail._id) return
    
    // Rediriger vers la page appropriée en fonction du type de travail
    // avec les informations sur les questions
    const basePath = `/travaux/${anneeId ? `${travail.matiereId}_${anneeId}` : travail.matiereId}/resolution`
    
    // Préparer les données pour la route
    const encodedTravail = encodeURIComponent(JSON.stringify({
      id: travail._id,
      titre: travail.titre,
      type: travail.type,
      statut: travail.statut,
      date_fin: travail.date_fin,
      questions: travail.questions || []
    }))
    
    switch (travail.type) {
      case 'QCM':
        router.push(`${basePath}/qcm/${travail._id}?travail=${encodedTravail}`)
        break
      case 'QUESTION':
        router.push(`${basePath}/question/${travail._id}?travail=${encodedTravail}`)
        break
      case 'REPONSE':
        router.push(`${basePath}/reponse/${travail._id}?travail=${encodedTravail}`)
        break
      default:
        router.push(`${basePath}/${travail._id}?travail=${encodedTravail}`)
    }
  }

  const handleDelete = async () => {
    if (!travail._id) return
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${travail.titre}" ?`)) {
      setIsDeleting(true)
      try {
        await deleteTravail(travail._id)
      } catch (error) {
        console.error('Erreur lors de la suppression du travail:', error)
        alert('Erreur lors de la suppression du travail')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{travail.titre}</h2>
          <p className="text-gray-600 text-sm mt-1 mb-3">{travail.description}</p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(travail.date_fin).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{travail.questions?.length || 0} question(s)</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className={`inline-block px-2.5 py-0.5 mb-4 text-xs rounded-full font-medium ${
            travail.statut === 'EN ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
            travail.statut === 'EN COURS' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {travail.statut}
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
              title="Supprimer"
              disabled={isDeleting}
            >
              <Trash className="w-4 h-4" />
            </button>
            <button 
              onClick={handleViewResolutions}
              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md"
              title="Voir les résolutions"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {travail.type && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between w-full">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Type: {travail.type}
            </span>
            
            <div className="flex items-center gap-2">
              <select
                value={travail.statut}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  const payload = { ...travail, statut: newStatus };

                  console.log('Payload:', payload);
                  if (travail._id) {
                    try {
                      await updateTravail(travail._id, payload);
                    } catch (error) {
                      console.error('Erreur lors du changement de statut:', error);
                    }
                  }
                }}
                className="text-sm border border-gray-300 rounded py-1 pl-2 pr-8 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="EN ATTENTE">En attente</option>
                <option value="EN COURS">En cours</option>
                <option value="TERMINE">Terminé</option>
              </select>
              
              <button
                onClick={handleViewResolutions}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <span>Résolutions</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}