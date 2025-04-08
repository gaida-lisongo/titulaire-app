import { Plus } from 'lucide-react'
import { useQCMStore } from '../store/qcmStore'

export default function QCMBanner() {
  const setIsModalOpen = useQCMStore((state) => state.setIsModalOpen)

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Questionnaires à Choix Multiples</h1>
          <p className="text-blue-100">Gérez vos QCMs et suivez les progrès de vos étudiants</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors"
        >
          <Plus size={20} />
          Nouveau QCM.
        </button>
      </div>
    </div>
  )
}