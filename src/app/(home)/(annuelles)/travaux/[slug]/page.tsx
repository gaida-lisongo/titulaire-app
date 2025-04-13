'use client'

import { useState, useEffect, use } from 'react'
import { TravailBanner } from './components/TravailBanner'
import { TravailCard } from './components/TravailCard'
import { CreateTravailForm } from './components/CreateTravailForm'
import { QcmModal } from './components/modals/QcmModal'
import { QuestionModal } from './components/modals/QuestionModal'
import { ReponseModal } from './components/modals/ReponseModal'
import { useTravauxContext } from '../contexts/TravauxContext'
import type { Travail, Question } from '@/types/travail'
import { useTitulaireStore } from '@/store/titulaireStore'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function TravauxPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const { travaux, isLoading, error, updateTravail, loadTravaux } = useTravauxContext()
  const { travaux : travail, setTravaux } = useTitulaireStore()
  const [selectedTravail, setSelectedTravail] = useState<Travail | null>(null)
  const [isQcmModalOpen, setIsQcmModalOpen] = useState(false)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const [isReponseModalOpen, setIsReponseModalOpen] = useState(false)

  useEffect(() => {
    const [matiereId] = resolvedParams.slug.split('_')
    if (matiereId) {
      loadTravaux(matiereId)
    }
  }, [resolvedParams.slug, loadTravaux])

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

  useEffect(() => {
    console.log('Selected travail:', travail)
  }, [])
  // Extraire matiereId et anneeId du slug
  const [matiereId, anneeId] = resolvedParams.slug.split('_')

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  return (
    <div className="space-y-8">
      {travail && <TravailBanner slug={resolvedParams.slug} info={travail} />}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="grid gap-6">
            {travaux.map((travail) => (
              <TravailCard
                key={travail._id}
                travail={travail}
                onEdit={() => handleEditTravail(travail)}
                anneeId={anneeId} // Passer anneeId ici
              />
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <CreateTravailForm slug={matiereId} />
        </div>
      </div>

      <QcmModal
        isOpen={isQcmModalOpen}
        onClose={() => {
          setIsQcmModalOpen(false)
          setSelectedTravail(null)
        }}
        onSave={(questions) => {
          if (selectedTravail?._id) {
            updateTravail(selectedTravail._id, { questions })
            setIsQcmModalOpen(false)
            setSelectedTravail(null)
          }
        }}
        totalQuestions={selectedTravail?.nombreQuestions || 0}
      />

      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => {
          setIsQuestionModalOpen(false)
          setSelectedTravail(null)
        }}
        onSave={(enonce) => {
          if (selectedTravail?._id) {
            updateTravail(selectedTravail._id, { questions: enonce })
            setIsQuestionModalOpen(false)
            setSelectedTravail(null)
          }
        }}
        initialQuestion={selectedTravail?.questions[0]?.enonce}
        totalQuestions={selectedTravail?.questions.length || 0}
        lastQuestions={selectedTravail?.questions}
      />

      <ReponseModal
        isOpen={isReponseModalOpen}
        onClose={() => {
          setIsReponseModalOpen(false)
          setSelectedTravail(null)
        }}
        onSave={(url) => {
          console.log('URL:', url)
          if (selectedTravail?._id) {
            const payload = {
              ...selectedTravail,
              questions: [
                {
                  url: url
                }
              ]
            }

            console.log('Payload:', payload)
            updateTravail(selectedTravail._id, payload)
            setIsReponseModalOpen(false)
            setSelectedTravail(null)
          }
        }}
      />
    </div>
  )
}