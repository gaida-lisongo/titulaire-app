export type TravailType = 'QCM' | 'QUESTION' | 'REPONSE'

import { useState } from 'react'
import { useTravauxContext } from '../../contexts/TravauxContext'
import { useAuthStore } from '@/store/useAuthStore'

interface CreateTravailFormProps {
  slug: string
}

export function CreateTravailForm({ slug }: CreateTravailFormProps) {
  const { addTravail } = useTravauxContext()
  const [selectedType, setSelectedType] = useState<TravailType>('QCM')
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_fin: '',
    montant: 0,
    type: selectedType,
    matiereId: slug,
  })
  const { agent } = useAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agent?.id) return
    
    addTravail({
      ...formData,
      date_fin: new Date(formData.date_fin),
      auteurId: agent?.id,
      statut: 'EN ATTENTE',
      questions: []
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Nouveau Travail</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type de travail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de travail
          </label>
          <div className="grid grid-cols-1 gap-4">
            {(['QCM', 'QUESTION', 'REPONSE'] as TravailType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setSelectedType(type)
                  setFormData({ ...formData, type })
                }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{type}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {type === 'QCM' && 'Questions à choix multiples'}
                  {type === 'QUESTION' && 'Question avec réponse libre'}
                  {type === 'REPONSE' && 'Réponse avec fichier'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Champs de base */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <input
            type="text"
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded-lg min-h-[100px]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date limite
          </label>
          <input
            type="datetime-local"
            value={formData.date_fin}
            onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant (FC)
          </label>
          <input
            type="number"
            value={formData.montant}
            onChange={(e) => setFormData({ ...formData, montant: Number(e.target.value) })}
            className="w-full p-2 border rounded-lg"
            required
            min="0"
          />
        </div>

        {/* Configuration spécifique selon le type */}
        {selectedType === 'QCM' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de questions
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded-lg"
                defaultValue={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points par question
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded-lg"
                defaultValue={1}
              />
            </div>
          </div>
        )}

        {/* Configurations pour autres types... */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Créer le travail
        </button>
      </form>
    </div>
  )
}