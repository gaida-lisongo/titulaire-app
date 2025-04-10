'use client'

import { useState } from 'react'
import { X, Save, CheckCircle, XCircle } from 'lucide-react'

interface QcmCorrectionModalProps {
  isOpen: boolean
  onClose: () => void
  student: any // Remplacer par un type plus précis plus tard
  onNoter: (note: number, comment: string, resolutionId: string) => void
}

export function QcmCorrectionModal({
  isOpen,
  onClose,
  student,
  onNoter
}: QcmCorrectionModalProps) {
  const [note, setNote] = useState<number>(student?.note || 0)
  const [comment, setComment] = useState<string>(student?.commentaire || '')

  if (!isOpen || !student) return null

  // Simuler des réponses QCM (à remplacer par les vraies données)
  const qcmReponses = [
    { 
      question: "Quelle est la capitale de la France?", 
      choices: ["Madrid", "Berlin", "Paris", "Rome"],
      correctAnswer: 2, // Index de la bonne réponse
      studentAnswer: 2  // Index de la réponse de l'étudiant
    },
    { 
      question: "Quelle est la capitale de l'Allemagne?", 
      choices: ["Madrid", "Berlin", "Paris", "Rome"],
      correctAnswer: 1,
      studentAnswer: 3
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNoter(note, comment, student._id)
  }

  // Calcul automatique de la note en fonction des bonnes réponses
  const calculateScore = () => {
    const correctAnswers = qcmReponses.filter(q => q.correctAnswer === q.studentAnswer).length
    return Math.round((correctAnswers / qcmReponses.length) * 20)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            Réponses QCM de {student.nom}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium mb-3">Détails de l'étudiant</h3>
            <div className="flex gap-4 items-center mb-4">
              <img 
                src={student.avatar} 
                alt={student.nom}
                className="w-12 h-12 rounded-full" 
              />
              <div>
                <p className="font-medium">{student.nom}</p>
                <p className="text-sm text-gray-600">Matricule: {student.matricule}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">
              Résultats du QCM ({qcmReponses.filter(q => q.correctAnswer === q.studentAnswer).length}/{qcmReponses.length} réponses correctes)
            </h3>
            
            {qcmReponses.map((qcm, index) => (
              <div key={index} className="border rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">Question {index + 1}</h4>
                <p className="mb-3">{qcm.question}</p>
                
                <ul className="space-y-2">
                  {qcm.choices.map((choice, i) => (
                    <li 
                      key={i} 
                      className={`p-2 rounded flex items-center justify-between ${
                        qcm.studentAnswer === i && qcm.correctAnswer === i
                          ? 'bg-green-50 border border-green-200'
                          : qcm.studentAnswer === i
                            ? 'bg-red-50 border border-red-200'
                            : qcm.correctAnswer === i
                              ? 'bg-gray-50 border border-gray-200'
                              : ''
                      }`}
                    >
                      <span>{choice}</span>
                      {qcm.studentAnswer === i && qcm.correctAnswer === i && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {qcm.studentAnswer === i && qcm.correctAnswer !== i && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setNote(calculateScore())}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Calculer automatiquement la note
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="note">
                Note (sur 20)
              </label>
              <input
                id="note"
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={note}
                onChange={(e) => setNote(Number(e.target.value))}
                className="border px-3 py-2 rounded-md w-28"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" htmlFor="comment">
                Commentaire
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border px-3 py-2 rounded-md w-full h-32 resize-none"
                placeholder="Ajoutez un commentaire pour l'étudiant..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer la note
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}