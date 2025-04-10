'use client'

import { useState, useEffect, use } from 'react'
import { NotebookPen, File, Download } from 'lucide-react'
import { ReponseCorrectionModal } from './components/ReponseCorrectionModal'
import TitulaireService from '@/api/titulaireService'

function EmptyState() {
  return (
    <div className="text-center py-12 px-4">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <File className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune résolution soumise</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Aucun étudiant n'a encore soumis de résolution pour ce travail. Les résolutions apparaîtront ici quand les étudiants commenceront à les envoyer.
      </p>
      <div className="inline-flex items-center text-sm text-blue-600">
        <span>Les soumissions s'afficheront automatiquement</span>
      </div>
    </div>
  )
}


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
  etudiantId: EtudiantInfo | string // Peut être un objet ou juste l'ID
  note?: number
  commentaire?: string
  url?: string
  date_creation: string | Date
  reponses?: any[]
}

interface PageProps {
  params: Promise<{ 
    slug: string
    id: string 
  }>
}

export default function ReponseResolutionsPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const [resolutions, setResolutions] = useState<Resolution[] | []>([])
  const [selectedStudent, setSelectedStudent] = useState<Resolution | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadResolutions = async () => {
      try {
        setIsLoading(true)
        const data = await TitulaireService.getResolutionsByTravailId(resolvedParams.id)
        console.log('Resolutions:', data)
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
  if (resolutions.length === 0) {
    return (<>
      <EmptyState />
    </>)
  }
  // Fonction pour extraire le nom complet de l'étudiant
  const getStudentName = (resolution: Resolution): string => {
    if (typeof resolution.etudiantId === 'object' && resolution.etudiantId !== null) {
      const { infoPerso } = resolution.etudiantId;
      return `${infoPerso.nom} ${infoPerso.postNom} ${infoPerso.preNom}`.trim();
    }
    return 'Étudiant inconnu';
  }
  
  // Fonction pour extraire le matricule de l'étudiant
  const getStudentMatricule = (resolution: Resolution): string => {
    if (typeof resolution.etudiantId === 'object' && resolution.etudiantId !== null) {
      return resolution.etudiantId.infoSec?.etudiantId || 'N/A';
    }
    return 'N/A';
  }
  
  // Fonction pour extraire l'avatar de l'étudiant
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
    } catch (error)  {
      console.error('Erreur lors de la notation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Fichiers soumis par les étudiants</h2>
      
      {isLoading && !selectedStudent ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 h-16 rounded"></div>
          ))}
        </div>
      ) : resolutions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Aucun fichier soumis pour ce travail
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Fichier</th>
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
                  <td className="px-6 py-4">
                    {resolution.url ? (
                      <a 
                        href={resolution.url} 
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <File className="w-4 h-4 mr-2" />
                        Télécharger
                      </a>
                    ) : (
                      <span className="text-gray-400">Aucun fichier</span>
                    )}
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
                      Noter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ReponseCorrectionModal
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
          url: selectedStudent?.url || '',
          date_creation: selectedStudent?.date_creation || new Date()
        }}
        onNoter={handleNoter}
      />
    </div>
  )
}