'use client'

import { useState } from 'react'
import { Plus, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/utils/formatDate'

interface Question {
  enonce: string
  type: 'QCM' | 'LIBRE' | 'FICHIER'
  choix: string[]
  reponse: string
}

export default function QCMDetailPage({ params }: { params: { slug: string } }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    enonce: '',
    type: 'QCM',
    choix: ['', '', '', '', ''],
    reponse: ''
  })

  const handleChoixChange = (index: number, value: string) => {
    const newChoix = [...currentQuestion.choix]
    newChoix[index] = value
    setCurrentQuestion({ ...currentQuestion, choix: newChoix })
  }

  const addQuestion = () => {
    if (!currentQuestion.enonce || currentQuestion.choix.some(c => !c)) {
      alert('Veuillez remplir tous les champs')
      return
    }
    
    setQuestions([...questions, currentQuestion])
    setCurrentQuestion({
      enonce: '',
      type: 'QCM',
      choix: ['', '', '', '', ''],
      reponse: ''
    })
  }

  const saveQCM = () => {
    // Implement API call to save QCM
    console.log('Saving QCM:', questions)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/qcm"
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-2" size={20} />
          Retour aux QCMs
        </Link>
        <button
          onClick={saveQCM}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          <Save size={20} />
          Enregistrer
        </button>
      </div>

      {/* Question Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Nouvelle Question</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Énoncé
            </label>
            <textarea
              value={currentQuestion.enonce}
              onChange={(e) => setCurrentQuestion({...currentQuestion, enonce: e.target.value})}
              className="w-full p-3 border rounded-lg min-h-[100px]"
              placeholder="Saisissez l'énoncé de la question..."
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Propositions de réponses
            </label>
            {currentQuestion.choix.map((choix, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="radio"
                  name="reponse"
                  checked={currentQuestion.reponse === String(index)}
                  onChange={() => setCurrentQuestion({...currentQuestion, reponse: String(index)})}
                  className="mt-3"
                />
                <input
                  type="text"
                  value={choix}
                  onChange={(e) => handleChoixChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder={`Proposition ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={addQuestion}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Ajouter la question
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">Question {index + 1}</h3>
              <span className="text-sm text-gray-500">
                {formatDate(new Date())} {/* Example of date formatting */}
              </span>
            </div>
            <p className="mb-4">{question.enonce}</p>
            <div className="space-y-2">
              {question.choix.map((choix, choixIndex) => (
                <div
                  key={choixIndex}
                  className={`p-3 rounded-lg ${
                    question.reponse === String(choixIndex)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50'
                  }`}
                >
                  {choix}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}