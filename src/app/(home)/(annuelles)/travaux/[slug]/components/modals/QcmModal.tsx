import { useState } from 'react'
import { X, Plus, Save, Trash } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Question } from '@/types/travail'

const MathEditor = dynamic(() => import('@/components/shared/MathEditor'), {
  ssr: false
})

interface QcmModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (questions: Question[]) => void
  totalQuestions: number
}

export function QcmModal({ isOpen, onClose, onSave, totalQuestions }: QcmModalProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    enonce: '',
    type: 'QCM',
    choix: Array(7).fill(''),
    reponse: ''
  })

  const [showQuestionsList, setShowQuestionsList] = useState(false)

  const handleAddQuestion = () => {
    if (currentQuestion.enonce && currentQuestion.choix?.some(c => c)) {
      setQuestions(prev => 
        [...prev, { ...currentQuestion }])
      // Reset current question
      setCurrentQuestion({
        enonce: '',
        type: 'QCM',
        choix: Array(7).fill(''),
        reponse: ''
      })
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    if (!currentQuestion.choix) return
    
    const newChoix = [...currentQuestion.choix]
    newChoix[index] = value
    setCurrentQuestion(prev => ({
      ...prev,
      choix: newChoix
    }))
  }

  const handleCorrectAnswer = (index: number) => {
    setCurrentQuestion(prev => ({
      ...prev,
      reponse: index.toString()
    }))
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
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <button
                    onClick={() => {
                      setQuestions(prev => prev.filter((_, i) => i !== index))
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </div>
                <div className="prose max-w-none mb-4">{question.enonce}</div>
                <div className="space-y-2">
                  {question.choix?.map((choix, i) => (
                    choix && (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={question.reponse === i.toString()}
                          readOnly
                          className="w-4 h-4"
                        />
                        <span>{choix}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question {questions.length + 1}
              </label>
              <MathEditor
                value={currentQuestion.enonce}
                onChange={(value) => setCurrentQuestion(prev => ({ ...prev, enonce: value }))}
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Options de réponse
              </label>
              {currentQuestion.choix?.map((choix, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentQuestion.reponse === index.toString()}
                    onChange={() => handleCorrectAnswer(index)}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    value={choix}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleAddQuestion}
                disabled={!currentQuestion.enonce || !currentQuestion.choix?.some(c => c)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Plus size={20} />
                Ajouter cette question
              </button>
              
              <button
                onClick={() => onSave(questions)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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