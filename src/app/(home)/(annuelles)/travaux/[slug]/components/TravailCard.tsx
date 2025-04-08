import { Clock, Calendar, DollarSign, Eye, Settings } from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { useTravauxContext } from '../../contexts/TravauxContext'

interface TravailCardProps {
  travail: any
  onEdit: () => void
}

export function TravailCard({ travail, onEdit }: TravailCardProps) {
  const { updateTravail, publishTravail } = useTravauxContext()

  const handleStatusChange = (checked: boolean) => {
    const newStatus = checked ? 'EN COURS' : 'EN ATTENTE'
    updateTravail(travail.id, { statut: newStatus })
  }

  const handlePublish = async (checked: boolean) => {
    if (checked && !travail.isPublished) {
      try {
        await publishTravail(travail._id)
      } catch (error) {
        // Gérer l'erreur (afficher une notification, etc.)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{travail.titre}</h3>
          <span className={`inline-block px-2 py-1 text-sm rounded-full ${
            travail.statut === 'EN ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
            travail.statut === 'EN COURS' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {travail.statut}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">En cours</span>
            <Switch
              checked={travail.statut === 'EN COURS'}
              onCheckedChange={handleStatusChange}
            />
          </div>

          <Link 
            href={`/travaux/${travail.id}/resolution/${travail.type}/${travail.id}`}
            className="p-2 text-blue-600 hover:text-blue-800"
          >
            <Eye size={20} />
          </Link>
          
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{travail.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            Date limite: {new Date(travail.date_fin).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>{travail.montant} FC</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-gray-500">Publier</span>
        <Switch
          checked={travail.isPublished}
          onCheckedChange={handlePublish}
          disabled={!travail.questions.length}
        />
      </div>
    </div>
  )
}