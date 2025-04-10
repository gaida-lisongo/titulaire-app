'use client'

import { useState, useEffect, use } from 'react'
import { useSearchParams } from 'next/navigation'
import { NotebookPen, MessageSquare } from 'lucide-react'
import { QuestionCorrectionModal } from './components/QuestionCorrectionModal'
import TitulaireService from '@/api/titulaireService'

interface EtudiantInfo {
  _id: string
  infoPerso: {
    nom: string
    postNom: string
    preNom: string
    profile: string
  }
  infoSec: {
    etudiantId: string
    email: string
  }
}

interface Resolution {
  _id: string
  travailId: string
  etudiantId: EtudiantInfo | string
  note?: number
  commentaire?: string
  reponses?: any[]
  date_creation: string | Date
}

function EmptyState() {
  return (
    <div className="text-center py-12 px-4">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <MessageSquare className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune résolution soumise</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Aucun étudiant n'a encore soumis de réponses pour ce travail. Les résolutions apparaîtront ici quand les étudiants commenceront à les envoyer.
      </p>
      <div className="inline-flex items-center text-sm text-blue-600">
        <span>Les soumissions s'afficheront automatiquement</span>
      </div>
    </div>
  )
}

interface PageProps {
  params: Promise<{ 
    slug: string
    id: string 
  }>
}

export default function QuestionResolutionsPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const travailParam = searchParams.get('travail')
  
  // Récupérer le travail depuis les paramètres d'URL
  const [travail, setTravail] = useState<any>(null)
  const [resolutions, setResolutions] = useState<Resolution[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Resolution | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Charger le travail depuis les paramètres d'URL
  useEffect(() => {
    if (travailParam) {
      try {
        const decodedTravail = JSON.parse(decodeURIComponent(travailParam))
        setTravail(decodedTravail)
      } catch (error) {
        console.error("Erreur lors du décodage des données du travail:", error)
      }
    }
  }, [travailParam])

  useEffect(() => {
    const loadResolutions = async () => {
      try {
        setIsLoading(true)
        const data = await TitulaireService.getResolutionsByTravailId(resolvedParams.id)
        console.log('Resolutions chargées:', data)
        if (data && data.length > 0) {
          setResolutions(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des résolutions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadResolutions()
  }, [resolvedParams.id])
  
  // Fonctions d'aide pour extraire les données d'étudiant
  const getStudentName = (resolution: Resolution): string => {
    if (typeof resolution.etudiantId === 'object' && resolution.etudiantId !== null) {
      const { infoPerso } = resolution.etudiantId;
      return `${infoPerso.nom} ${infoPerso.postNom} ${infoPerso.preNom}`.trim();
    }
    return 'Étudiant inconnu';
  }
  
  const getStudentMatricule = (resolution: Resolution): string => {
    if (typeof resolution.etudiantId === 'object' && resolution.etudiantId !== null) {
      return resolution.etudiantId.infoSec?.etudiantId || 'N/A';
    }
    return 'N/A';
  }
  
  const getStudentAvatar = (resolution: Resolution): string => {
    if (typeof resolution.etudiantId === 'object' && resolution.etudiantId !== null) {
      return resolution.etudiantId.infoPerso?.profile || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
    }
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
  }
  
  // Fonction de notation des travaux
  const handleNoter = async (note: number, comment: string, resolutionId: string) => {
    try {
      setIsLoading(true)
      // Appel à l'API pour mettre à jour la note
      await TitulaireService.setCoteResolution(resolutionId, { note, comment })
      
      // Mise à jour des données locales
      setResolutions(prev => 
        prev.map(res => 
          res._id === resolutionId 
            ? { ...res, note, commentaire: comment } 
            : res
        )
      )
      
      setIsModalOpen(false)
      setSelectedStudent(null)
    } catch (error) {
      console.error('Erreur lors de la notation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Vérification du chargement initial et des résolutions vides
  if (isLoading && resolutions.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-gray-100 h-16 rounded"></div>
        ))}
      </div>
    );
  }
  
  // Vérification des résolutions vides après le chargement
  if (!isLoading && resolutions.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">
        Réponses des étudiants
      </h2>
      
      {isLoading && selectedStudent ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 h-16 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Avatar</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Matricule</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date soumission</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Note</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resolutions.map((resolution) => (
                <tr key={resolution._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img 
                      src={getStudentAvatar(resolution)}
                      alt={getStudentName(resolution)}
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">{getStudentMatricule(resolution)}</td>
                  <td className="px-6 py-4 text-sm">{getStudentName(resolution)}</td>
                  <td className="px-6 py-4 text-sm">
                    {resolution.date_creation ? new Date(resolution.date_creation).toLocaleDateString() : 'Date inconnue'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {resolution.note ? `${resolution.note}/20` : 'Non noté'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedStudent(resolution)
                        setIsModalOpen(true)
                      }}
                      className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <NotebookPen className="h-4 w-4 mr-2" />
                      Voir les réponses
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <QuestionCorrectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedStudent(null)
        }}
        student={{
          _id: selectedStudent?._id || '',
          nom: selectedStudent ? getStudentName(selectedStudent) : '',
          matricule: selectedStudent ? getStudentMatricule(selectedStudent) : '',
          avatar: selectedStudent ? getStudentAvatar(selectedStudent) : '',
          note: selectedStudent?.note,
          commentaire: selectedStudent?.commentaire,
          reponses: selectedStudent?.reponses || [],
          date_creation: selectedStudent?.date_creation || new Date()
        }}
        onNoter={handleNoter}
      />
    </>
  )
}