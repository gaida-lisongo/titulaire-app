'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { Travail, Etudiant } from '@/types/travail'

interface CorrectionModalProps {
  isOpen: boolean
  onClose: () => void
  etudiant: Etudiant | null
  travail: Travail | null
  onNoter: (note: number, etudiantId: string) => void
}

export function CorrectionModal({
  isOpen,
  onClose,
  etudiant,
  travail,
  onNoter
}: CorrectionModalProps) {
  const [note, setNote] = useState<number>(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  if (!isOpen || !etudiant || !travail) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              Réponses de {etudiant.nom}
            </h2>
            <p className="text-sm text-gray-500">
              Matricule: {etudiant.matricule}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {travail.questions.map((question, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer ${
                currentQuestion === index ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              <h3 className="font-medium mb-2">Question {index + 1}</h3>
              <div 
                className="prose max-w-none mb-4" 
                dangerouslySetInnerHTML={{ __html: question.enonce || '' }} 
              />
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Réponse de l'étudiant:
                </h4>
                <div className="prose max-w-none">
                  {/* Contenu de la réponse */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer avec notation */}
        <div className="flex items-center justify-end gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Note:</label>
            <input
              type="number"
              min="0"
              max="20"
              value={note}
              onChange={(e) => setNote(Number(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">/20</span>
          </div>
          <button
            onClick={() => onNoter(note, etudiant._id)}
            disabled={note < 0 || note > 20}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Enregistrer la note
          </button>
        </div>
      </div>
    </div>
  )
}