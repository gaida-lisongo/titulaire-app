import { create } from 'zustand'

interface QCM {
  id: string
  titre: string
  description: string
  matiereId: string
  matiereName: string
  date_created: Date
  date_fin: Date
  auteurId: string
  montant: number
  published: boolean
}

interface QCMStore {
  qcms: QCM[]
  selectedQCM: QCM | null
  isModalOpen: boolean
  setQCMs: (qcms: QCM[]) => void
  setSelectedQCM: (qcm: QCM | null) => void
  setIsModalOpen: (isOpen: boolean) => void
  addQCM: (qcm: QCM) => void
  publishQCM: (id: string) => void
  deleteQCM: (id: string) => void
}

export const useQCMStore = create<QCMStore>((set) => ({
  qcms: [],
  selectedQCM: null,
  isModalOpen: false,
  setQCMs: (qcms) => set({ qcms }),
  setSelectedQCM: (qcm) => set({ selectedQCM: qcm }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  addQCM: (qcm) => set((state) => ({ qcms: [...state.qcms, qcm] })),
  publishQCM: (id) => set((state) => ({
    qcms: state.qcms.map(qcm => 
      qcm.id === id ? { ...qcm, published: true } : qcm
    )
  })),
  deleteQCM: (id) => set((state) => ({
    qcms: state.qcms.filter(qcm => qcm.id !== id)
  }))
}))