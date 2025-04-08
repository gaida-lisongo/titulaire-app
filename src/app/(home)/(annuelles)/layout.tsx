'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTitulaireStore } from '@/store/titulaireStore'

interface Promotion {
  id: number
  name: string
  year: string
}

export default function AnnuellesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
      
    </div>
  )
}