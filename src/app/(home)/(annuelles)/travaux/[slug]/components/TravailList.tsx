'use client'

import { useMemo } from 'react'
import { useTravauxContext } from '../../contexts/TravauxContext'
import { Clock, Calendar, DollarSign } from 'lucide-react'

interface TravailCardProps {
  travail: any
  onClick: () => void
}

function TravailCard({ travail, onClick }: TravailCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{travail.titre}</h3>
        <span className={`px-2 py-1 rounded-md text-sm ${
          travail.statut === 'EN ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
          travail.statut === 'EN COURS' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {travail.statut}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{travail.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Date limite: {new Date(travail.date_fin).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>{travail.montant} FC</span>
        </div>
      </div>
    </div>
  )
}

export function TravailList({ slug, onTravailClick }: { slug: string, onTravailClick: (travail: any) => void }) {
  const { travaux, isLoading, searchQuery } = useTravauxContext()
  
  // Calculer les travaux filtrés à l'intérieur du composant plutôt que de les récupérer du contexte
  const filteredTravaux = useMemo(() => {
    if (!searchQuery || !travaux) return travaux || []
    
    return travaux.filter(travail => {
      const titre = travail.titre?.toLowerCase() || ''
      const description = travail.description?.toLowerCase() || ''
      const query = searchQuery.toLowerCase()
      
      return titre.includes(query) || description.includes(query)
    })
  }, [travaux, searchQuery])

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!filteredTravaux || filteredTravaux.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery 
          ? "Aucun travail ne correspond à votre recherche"
          : "Aucun travail disponible pour le moment"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {filteredTravaux.map((travail) => (
        <TravailCard
          key={travail._id} // Utiliser _id ou id en fonction de ce qui est disponible
          travail={travail}
          onClick={() => onTravailClick(travail)}
        />
      ))}
    </div>
  )
}