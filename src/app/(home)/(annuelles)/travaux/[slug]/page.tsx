'use client'

import { useState, use } from 'react'
import { TravailBanner } from './components/TravailBanner'
import { TravailCard } from './components/TravailCard'
import { CreateTravailForm } from './components/CreateTravailForm'
import { QcmModal } from './components/modals/QcmModal'
import { QuestionModal } from './components/modals/QuestionModal'
import { ReponseModal } from './components/modals/ReponseModal'
import { useTravauxContext } from '../contexts/TravauxContext'
import type { Travail, Question } from '@/types/travail'

export default function TravauxPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const { travaux, updateTravail } = useTravauxContext()
  
  const [selectedTravail, setSelectedTravail] = useState<Travail | null>(null)
  const [isQcmModalOpen, setIsQcmModalOpen] = useState(false)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const [isReponseModalOpen, setIsReponseModalOpen] = useState(false)

  const handleSaveQcm = (questions: Question[]) => {
    if (selectedTravail) {
      updateTravail(selectedTravail._id!, { questions })
      setIsQcmModalOpen(false)
      setSelectedTravail(null)
    }
  }

  const handleSaveQuestion = (enonce: string) => {
    if (selectedTravail) {
      const question: Question = {
        enonce,
        type: 'LIBRE'
      }
      updateTravail(selectedTravail._id!, { questions: [question] })
      setIsQuestionModalOpen(false)
      setSelectedTravail(null)
    }
  }

  const handleSaveReponse = (url: string) => {
    if (selectedTravail) {
      const question: Question = {
        enonce: "Fichier à rendre",
        type: 'FICHIER',
        url
      }
      updateTravail(selectedTravail._id!, { questions: [question] })
      setIsReponseModalOpen(false)
      setSelectedTravail(null)
    }
  }

  const handleEditTravail = (travail: Travail) => {
    setSelectedTravail(travail)
    switch (travail.type) {
      case 'QCM':
        setIsQcmModalOpen(true)
        break
      case 'QUESTION':
        setIsQuestionModalOpen(true)
        break
      case 'REPONSE':
        setIsReponseModalOpen(true)
        break
    }
  }

  return (
    <div className="space-y-8">
      <TravailBanner slug={resolvedParams.slug} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="grid gap-6">
            {travaux.map((travail) => (
              <TravailCard
                key={travail._id}
                travail={travail}
                onEdit={() => handleEditTravail(travail)}
              />
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <CreateTravailForm slug={resolvedParams.slug} />
        </div>
      </div>

      <QcmModal
        isOpen={isQcmModalOpen}
        onClose={() => {
          setIsQcmModalOpen(false)
          setSelectedTravail(null)
        }}
        onSave={handleSaveQcm}
        totalQuestions={selectedTravail?.nombreQuestions || 0}
      />

      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => {
          setIsQuestionModalOpen(false)
          setSelectedTravail(null)
        }}
        onSave={handleSaveQuestion}
        initialQuestion={selectedTravail?.questions[0]?.enonce}
      />

      <ReponseModal
        isOpen={isReponseModalOpen}
        onClose={() => {
          setIsReponseModalOpen(false)
          setSelectedTravail(null)
        }}
        onSave={handleSaveReponse}
      />
    </div>
  )
}