import { use, useEffect, useState } from 'react'
import { X, Upload, File } from 'lucide-react'
import { useTravauxContext } from '../../../contexts/TravauxContext'
import { cn } from '@/lib/utils'
import { fi } from 'date-fns/locale'

interface ReponseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (url: string) => void
}

export function ReponseModal({ isOpen, onClose, onSave }: ReponseModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const { saveQuestion } = useTravauxContext()

  const fetchUrl = async () => {
    if (file) {
      const imageUrl = await saveQuestion(file as File)
      const url = await imageUrl.toString();

      console.log('Image URL:', url)
      if (imageUrl) {
        setUrl(imageUrl)
        onSave(url)
        onClose()
      } else {
        console.error('Erreur lors du téléchargement de l\'image')
      }
    }
  }

  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Ajouter un questionnaire</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload size={48} className="text-gray-400 mb-4" />
            <span className="text-gray-600">
              {file ? file.name : "Cliquez pour uploader ou déposez votre fichier ici"}
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={() => fetchUrl()}
            disabled={!file}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}