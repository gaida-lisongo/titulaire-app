'use client'

import QCMBanner from './components/QCMBanner'
import QCMCard from './components/QCMCard'
import CreateQCMModal from './components/CreateQCMModal'
import { useQCMStore } from './store/qcmStore'

export default function QCMListPage() {
  const qcms = useQCMStore((state) => state.qcms)

  return (
    <div className="container mx-auto px-4 py-8">
      <QCMBanner />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qcms.map((qcm) => (
          <QCMCard key={qcm.id} {...qcm} />
        ))}
      </div>

      <CreateQCMModal />
    </div>
  )
}
