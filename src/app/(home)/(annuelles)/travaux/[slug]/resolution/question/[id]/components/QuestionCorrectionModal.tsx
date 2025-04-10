'use client'

import { useState } from 'react'
import { X, Save, ChevronRight, ChevronLeft } from 'lucide-react'

interface QuestionCorrectionModalProps {
  isOpen: boolean
  onClose: () => void
  student: any // Remplacer par un type plus précis plus tard
  onNoter: (note: number, comment: string, resolutionId: string) => void
}

export function QuestionCorrectionModal({
  isOpen,
  onClose,
  student,
  onNoter
}: QuestionCorrectionModalProps) {
  const [note, setNote] = useState<number>(student?.note || 0)
  const [comment, setComment] = useState<string>(student?.commentaire || '')
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)

  if (!isOpen || !student) return null

  // Simuler des réponses (à remplacer par les vraies données)
  const questions = student.reponses || [
    { question: "Question 1", reponse: "Réponse 1" },
    { question: "Question 2", reponse: "Réponse 2" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNoter(note, comment, student._id)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            Réponses de {student.nom}
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
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">
                Question {currentQuestion + 1} / {questions.length}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="p-1 rounded hover:bg-gray-100 disabled:text-gray-300"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:text-gray-300"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="border rounded-md p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Question:</h4>
              <div className="prose max-w-none mb-4" 
                dangerouslySetInnerHTML={{ __html: questions[currentQuestion].question }} 
              />
              
              <h4 className="text-sm font-medium text-gray-700 mb-2">Réponse:</h4>
              <div className="prose max-w-none bg-gray-50 p-3 rounded" 
                dangerouslySetInnerHTML={{ __html: questions[currentQuestion].reponse }}
              />
            </div>
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