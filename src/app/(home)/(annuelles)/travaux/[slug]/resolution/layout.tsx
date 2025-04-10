'use client'

import { useEffect, useState, use } from 'react'
import { useSearchParams } from 'next/navigation'
import { File, CheckSquare, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import TitulaireService from '@/api/titulaireService'
import { mockTravail } from '@/mocks/resolutionsMock'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
    id?: string
  }>
}

export default function ResolutionLayout({ children, params }: LayoutProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const travailParam = searchParams.get('travail')
  const [travail, setTravail] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)
  const [travailId, setTravailId] = useState<string | null>(null)
  const [error, setError] = useState<boolean | null>(false)

  useEffect(() => {
    const loadTravail = async () => {
      setIsLoading(true)

      try {
        if (travailParam) {
          // Utiliser les données de l'URL
          const decodedTravail = JSON.parse(decodeURIComponent(travailParam))
          setTravail(decodedTravail)
        } else {
          throw new Error("Travail non trouvé dans les paramètres d'URL")
        }
      } catch (error) {
        console.error("Erreur lors du chargement du travail:", error)
        setTravail(mockTravail) // Utiliser les données mockées en cas d'erreur
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTravail()
  }, [travailParam, resolvedParams.id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse bg-gray-200 h-24 rounded-lg mb-6"></div>
        <div className="animate-pulse bg-gray-200 h-screen rounded-lg"></div>
      </div>
    )
  }

  // Construction du chemin de base pour les liens avec resolvedParams
  const basePath = `/travaux/${resolvedParams.slug}/resolution/${travail?.type?.toLowerCase() || 'question'}/${resolvedParams.id}?travail=${travailParam}`

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{travail?.titre || 'Travail'}</h1>
            <p className="text-gray-600 mt-2">{travail?.description}</p>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4">
              <div className="flex items-center gap-1.5">
                <span>Date limite: {new Date(travail?.date_fin).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <span>Type: {travail?.type}</span>
              </div>
            </div>
          </div>
          
          <div>
            <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
              travail?.statut === 'EN ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
              travail?.statut === 'EN COURS' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {travail?.statut || 'Inconnu'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar avec les questions */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Questions</h3>
            
            {travail?.questions?.length > 0 ? (
              <div className="space-y-2">
                {travail.questions.map((question: any, index: number) => (
                  <div 
                    key={question._id || index}
                    className={`p-3 rounded-lg cursor-pointer ${
                      activeQuestion === (question._id || index.toString()) 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => {
                      console.log('Question :', question.url)
                      window.open(question.url, '_blank')
                      setActiveQuestion(question._id || index.toString())
                    }}
                  >
                    <div className="flex items-center">
                      {travail.type === 'QCM' ? (
                        <CheckSquare className="w-5 h-5 mr-2 text-blue-500" />
                      ) : travail.type === 'QUESTION' ? (
                        <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                      ) : (
                        <File className="w-5 h-5 mr-2 text-green-500" />
                      )}
                      
                      <span className="text-sm">
                        {question.enonce ? (
                          question.enonce.length > 50 
                            ? `${question.enonce.substring(0, 50)}...` 
                            : question.enonce
                        ) : (
                          `Enoncé du travail`
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Aucune question disponible</p>
            )}
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}