import { use, useEffect, useState } from 'react'
import { X, Plus, Save, Trash } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Question } from '@/types/travail'

const MathEditor = dynamic(() => import('@/components/shared/MathEditor'), {
  ssr: false
})

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (questions: Question[]) => void
  initialQuestion?: string
  totalQuestions?: number,
  lastQuestions?: Question[] | []
}

// Interface locale pour garantir que l'énoncé est toujours une chaîne
interface LocalQuestion {
  enonce: string; // Jamais undefined
  type: 'QUESTION';
}

export function QuestionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialQuestion = '',
  totalQuestions = 1,
  lastQuestions
}: QuestionModalProps) {
  const [questions, setQuestions] = useState<LocalQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<string>(initialQuestion)
  const [showQuestionsList, setShowQuestionsList] = useState(false)

  const handleAddQuestion = () => {
    if (currentQuestion.trim()) {
      const newQuestion: LocalQuestion = {
        enonce: currentQuestion,
        type: 'QUESTION'
      }
      setQuestions(prev => [...prev, newQuestion])
      setCurrentQuestion('')
    }
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveAll = () => {
    if (onSave && questions.length > 0) {
      // Conversion du type LocalQuestion vers Question lors de la sauvegarde
      onSave(questions as unknown as Question[])
      onClose()
    }
  }

  useEffect(() => {
    if (lastQuestions && lastQuestions.length > 0) {
      // Conversion des questions existantes pour garantir que enonce est une chaîne
      const convertedQuestions = lastQuestions.map(q => ({
        enonce: q.enonce || '', // Fournir une chaîne vide comme fallback
        type: 'QUESTION' as const
      }));
      setQuestions(convertedQuestions);
    }
  }, [lastQuestions]) // Modifier la dépendance pour éviter la boucle infinie

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              Questions - {questions.length}/{totalQuestions}
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
            {questions.map((q, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <button
                    onClick={() => handleDeleteQuestion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </div>
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: q.enonce }} // q.enonce est maintenant toujours une chaîne
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <MathEditor
              value={currentQuestion}
              onChange={setCurrentQuestion}
              className="min-h-[300px]"
            />

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={handleAddQuestion}
                disabled={!currentQuestion.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Plus size={20} />
                Ajouter cette question
              </button>
              
              <button
                onClick={handleSaveAll}
                disabled={questions.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={20} />
                Enregistrer tout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}