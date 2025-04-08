import { useState } from 'react'
import { X } from 'lucide-react'
import dynamic from 'next/dynamic'

const MathEditor = dynamic(() => import('@/components/shared/MathEditor'), {
  ssr: false
})

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (question: string) => void
  initialQuestion?: string
}

export function QuestionModal({ isOpen, onClose, onSave, initialQuestion = '' }: QuestionModalProps) {
  const [question, setQuestion] = useState(initialQuestion)

  const handleSave = () => {
    if (onSave && question.trim()) {
      onSave(question)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Ajouter une question</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <MathEditor
          value={question}
          onChange={setQuestion}
          className="min-h-[300px]"
        />

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}