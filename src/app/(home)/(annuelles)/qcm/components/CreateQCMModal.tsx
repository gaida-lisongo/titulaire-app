import { useQCMStore } from '../store/qcmStore'
import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

export default function CreateQCMModal() {
  const isModalOpen = useQCMStore((state) => state.isModalOpen)
  const setIsModalOpen = useQCMStore((state) => state.setIsModalOpen)
  const addQCM = useQCMStore((state) => state.addQCM)

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    matiereId: '',
    date_fin: '',
    montant: 0,
    statut: 'EN ATTENTE' as const
  })

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation supplémentaire
    if (formData.montant < 0) {
      setError("Le montant ne peut pas être négatif")
      return
    }

    if (new Date(formData.date_fin) <= new Date()) {
      setError("La date de fin doit être ultérieure à la date actuelle")
      return
    }
    
    const newQCM = {
      id: crypto.randomUUID(),
      ...formData,
      date_created: new Date(),
      date_fin: new Date(formData.date_fin),
      auteurId: 'current-user-id',
      matiereName: 'Informatique',
      published: false,
      statut: 'EN ATTENTE' as const
    }

    addQCM(newQCM)
    setIsModalOpen(false)
    setFormData({
      titre: '',
      description: '',
      matiereId: '',
      date_fin: '',
      montant: 0,
      statut: 'EN ATTENTE'
    })
  }

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Créer un nouveau QCM</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value.trim() })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Titre du QCM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Description détaillée du QCM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matière <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.matiereId}
              onChange={(e) => setFormData({ ...formData, matiereId: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une matière</option>
              <option value="1">Informatique</option>
              <option value="2">Mathématiques</option>
              <option value="3">Physique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date limite <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={formData.date_fin}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant (FC) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: parseInt(e.target.value) })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Montant en Francs Congolais"
            />
            <p className="mt-1 text-sm text-gray-500">Minimum: 0 FC</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Créer le QCM
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}