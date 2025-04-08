import Image from 'next/image'
import { FileText, Calendar, Users, Search } from 'lucide-react'
import { useTravauxContext } from '../../contexts/TravauxContext'

interface TravailBannerProps {
  slug: string
}

export function TravailBanner({ slug }: TravailBannerProps) {
  const { travaux, searchQuery, setSearchQuery } = useTravauxContext()

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
              Informatique - Année 2024
            </h1>
            
            <div className="flex gap-8">
              <div className="flex items-center gap-2 text-white/90">
                <FileText className="w-5 h-5" />
                <span>{travaux.length} Travaux</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="w-5 h-5" />
                <span>2023-2024</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-5 h-5" />
                <span>45 Étudiants</span>
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