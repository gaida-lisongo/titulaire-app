import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Section } from '@/types/section'

interface SectionState {
  sections: Section[]
  activeSectionId: string | null
  setSections: (sections: Section[]) => void
  setActiveSection: (sectionId: string) => void
  clearSections: () => void
}

export const useSectionStore = create<SectionState>()(
  persist(
    (set) => ({
      sections: [],
      activeSectionId: null,
      setSections: (sections) => set({ sections }),
      setActiveSection: (sectionId) => set({ activeSectionId: sectionId }),
      clearSections: () => set({ 
        sections: [], 
        activeSectionId: null 
      }),
    }),
    {
      name: 'section-storage',
    }
  )
)