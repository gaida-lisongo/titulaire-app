import { useState } from 'react'
import { X, Plus, Save, Trash } from 'lucide-react'
import dynamic from 'next/dynamic'

// Import dynamique de l'éditeur mathématique
const MathEditor = dynamic(() => import('@/components/shared/MathEditor'), {
  ssr: false
})

interface QcmModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (questions: Question[]) => void
  totalQuestions: number
}

interface Question {
  id: string
  text: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
}

export function QcmModal({ isOpen, onClose, onSave, totalQuestions }: QcmModalProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: crypto.randomUUID(),
    text: '',
    options: Array(7).fill('').map(() => ({
      id: crypto.randomUUID(),
      text: '',
      isCorrect: false
    }))
  })

  const [showQuestionsList, setShowQuestionsList] = useState(false)

  const handleAddQuestion = () => {
    if (currentQuestion.text.trim() && currentQuestion.options.some(opt => opt.text.trim())) {
      setQuestions(prev => [...prev, currentQuestion])
      setCurrentQuestion({
        id: crypto.randomUUID(),
        text: '',
        options: Array(7).fill('').map(() => ({
          id: crypto.randomUUID(),
          text: '',
          isCorrect: false
        }))
      })
    }
  }

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId))
  }

  const handleSave = () => {
    const formattedQuestions: Question[] = questions.map(q => ({
      enonce: q.text,
      type: 'QCM',
      choix: q.options.map(opt => opt.text).filter(Boolean),
      reponse: q.options
        .map((opt, index) => opt.isCorrect ? index.toString() : null)
        .filter(Boolean)
        .join(',')
    }))
    
    onSave(formattedQuestions)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              QCM - {questions.length}/{totalQuestions} questions
            </h2>
            <button
              onClick={() => setShowQuestionsList(!showQuestionsList)}
              className="text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              {showQuestionsList ? "Retour à l'édition" : "Voir toutes les questions"}
            </button>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {showQuestionsList ? (
          // Liste des questions déjà créées
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </div>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: question.text }} />
                <div className="mt-2 space-y-1">
                  {question.options.map((opt, i) => (
                    opt.text && (
                      <div key={opt.id} className="flex items-center gap-2">
                        <input type="checkbox" checked={opt.isCorrect} readOnly />
                        <span>{opt.text}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Formulaire d'édition de question
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Éditeur de question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question {questions.length + 1}
                </label>
                <MathEditor
                  value={currentQuestion.text}
                  onChange={(value) => setCurrentQuestion(prev => ({ ...prev, text: value }))}
                  className="min-h-[200px]"
                />
              </div>

              {/* Options de réponse */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Options de réponse
                </label>
                {currentQuestion.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options]
                        newOptions[index].isCorrect = e.target.checked
                        setCurrentQuestion(prev => ({ ...prev, options: newOptions }))
                      }}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options]
                        newOptions[index].text = e.target.value
                        setCurrentQuestion(prev => ({ ...prev, options: newOptions }))
                      }}
                      className="flex-1 p-2 border rounded-lg"
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={!currentQuestion.text || currentQuestion.options.every(opt => !opt.text)}
              >
                <Plus size={20} />
                Ajouter cette question
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={questions.length !== totalQuestions}
              >
                <Save size={20} />
                Enregistrer le QCM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}