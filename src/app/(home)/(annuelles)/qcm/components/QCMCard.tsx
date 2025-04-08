import { Book, Calendar, Clock, Trash2, Save, DollarSign, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/utils/formatDate'
import { useQCMStore } from '../store/qcmStore'
import { useState } from 'react'

interface QCMCardProps {
  id: string
  titre: string
  description: string
  matiereId: string
  matiereName: string
  date_created: Date
  date_fin: Date
  auteurId: string
  montant: number
  published: boolean
  statut: 'EN ATTENTE' | 'EN COURS' | 'TERMINE'
}

const statusColors = {
  'EN ATTENTE': 'bg-yellow-100 text-yellow-800',
  'EN COURS': 'bg-blue-100 text-blue-800',
  'TERMINE': 'bg-green-100 text-green-800'
}

export default function QCMCard({
  id,
  titre,
  description,
  matiereName,
  date_created,
  date_fin,
  montant,
  published,
  statut
}: QCMCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteQCM, publishQCM } = useQCMStore()

  const handleDelete = () => {
    if (published || statut !== 'EN ATTENTE') {
      alert("Impossible de supprimer un QCM publié ou en cours")
      return
    }
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce QCM ?")) {
      setIsDeleting(true)
      deleteQCM(id)
    }
  }

  const handlePublish = () => {
    if (statut !== 'EN ATTENTE') {
      alert("Impossible de publier un QCM qui n'est pas en attente")
      return
    }
    
    if (window.confirm("Êtes-vous sûr de vouloir publier ce QCM ? Cette action est irréversible.")) {
      publishQCM(id)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-600">
          <Book size={20} />
          <span className="font-medium">{matiereName}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-yellow-600">
            <DollarSign size={16} />
            <span>{montant} FC</span>
          </div>
          <span className={`px-2 py-1 rounded-md text-sm ${statusColors[statut]}`}>
            {statut}
          </span>
          {!published && statut === 'EN ATTENTE' && (
            <div className="flex gap-2">
              <button
                onClick={handlePublish}
                className="p-2 text-green-600 hover:text-green-800"
                title="Publier"
              >
                <Save size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-800"
                title="Supprimer"
                disabled={isDeleting}
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <Link href={published ? `/qcm/${id}/view` : `/qcm/${id}/edit`}>
        <h2 className="text-xl font-semibold mb-3">{titre}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Créé le: {formatDate(date_created)}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle size={16} />
              <span>Date limite: {formatDate(date_fin)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{montant} Points</span>
          </div>
        </div>
      </Link>
    </div>
  )
}