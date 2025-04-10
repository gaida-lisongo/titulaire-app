import { Calendar, Clock } from 'lucide-react'
import type { Travail } from '@/types/travail'

interface ResolutionBannerProps {
  travail: Travail
}

export function ResolutionBanner({ travail }: ResolutionBannerProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-2">{travail.titre}</h1>
      <p className="text-gray-600 mb-4">{travail.description}</p>
      
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            Date limite: {new Date(travail.date_fin).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            {travail.questions.length} question{travail.questions.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}