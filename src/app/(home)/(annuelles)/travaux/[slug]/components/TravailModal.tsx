import { useState } from 'react'
import { X } from 'lucide-react'

type TravailType = 'QCM' | 'QUESTION' | 'REPONSE'

interface TravailModalProps {
  isOpen: boolean
  onClose: () => void
  travail: any
}

export function TravailModal({ isOpen, onClose, travail }: TravailModalProps) {
  const [selectedType, setSelectedType] = useState<TravailType>('QCM')
  const [formData, setFormData] = useState({
    ...travail,
    type: selectedType
  })

  if (!isOpen || !travail) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique de mise à jour avec le nouveau type
    console.log(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >   
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Configuration du travail</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de travail
            </label>
            <div className="grid grid-cols-3 gap-4">
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

          {selectedType === 'QUESTION' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de lignes pour la réponse
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded-lg"
                defaultValue={5}
              />
            </div>
          )}

          {selectedType === 'REPONSE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Types de fichiers acceptés
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>.pdf</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>.doc, .docx</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>.jpg, .png</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}