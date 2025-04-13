import Image from 'next/image'
import { FileText, Calendar, Users, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTravauxContext } from '../../contexts/TravauxContext'
import { BannerTravail } from '@/types/travail'
import { useTitulaireStore } from '@/store/titulaireStore'

interface TravailBannerProps {
  slug: string
  info: BannerTravail
}

export function TravailBanner({ slug, info}: TravailBannerProps) {
  const { travaux } = useTravauxContext()
  const [searchQuery, setSearchQuery] = useState('') // Utiliser un état local à la place
  const { updateTravaux } = useTitulaireStore();

  useEffect(() => {
    console.log('Travaux:', travaux) 
    const totalQcm = travaux.filter((travail) => travail.type === 'QCM').length
    const totalQuestion = travaux.filter((travail) => travail.type === 'QUESTION').length
    const totalReponse = travaux.filter((travail) => travail.type === 'REPONSE').length

    const updateInfo = {
      ...info,
      qcm: totalQcm,
      question: totalQuestion,
      reponse: totalReponse,
    }

    updateTravaux(updateInfo)
  }, [])
  return (
    <div className="relative h-80 rounded-2xl overflow-hidden">
      {/* Image de fond avec overlay */}
      <Image
        src="/images/banner/admin-inbtp.jpeg"
        alt="Banner"
        fill
        className="object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40">
        <div className="h-full flex flex-col justify-between p-8">
          {/* En-tête avec titre et stats */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {info.title} - {info.description}
            </h1>
            
            <div className="flex gap-8">
              <div className="flex items-center gap-2 text-white/90">
                <FileText className="w-5 h-5" />
                <span>{info.qcm} QCM</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="w-5 h-5" />
                <span>{info.question} QUESTION</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-5 h-5" />
                <span>{info.reponse} REPONSE</span>
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un travail par titre, type ou statut..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 
                focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30
                text-white placeholder-white/60 backdrop-blur-sm transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  )
}