import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import titulaireService from '@/api/titulaireService'
import { 
  faHome,
  faClipboardList,
  faBookOpen,
  faTrophy,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { BannerTravail } from '@/types/travail'

interface NavItem {
  title: string
  url?: string
  icon?: IconDefinition
  items?: NavItem[]
}

interface NavSection {
  label?: string
  icon?: IconDefinition
  items: NavItem[]
}

interface TitulaireState {
  chargesHoraire: any[]
  travaux: BannerTravail | null
  navData: NavSection[]
  isLoading: boolean
  error: string | null
  fetchChargesHoraire: (titulaireId: string) => Promise<void>
  resetError: () => void
  buildNavigation: () => void
  setTravaux: (data: BannerTravail) => void
  updateTravaux: (travail: BannerTravail) => void
}

export const useTitulaireStore = create<TitulaireState>()(
  persist(
    (set, get) => ({
      chargesHoraire: [],
      travaux: null,
      navData: [],
      isLoading: false,
      error: null,

      buildNavigation: async () => {
        const { chargesHoraire } = get()
        let customMenu: NavSection[] = []

        // Utiliser Promise.all pour attendre toutes les promesses
        await Promise.all(chargesHoraire.map(async (charges) => {
          const items = charges.charges_horaires
          let menuItem: NavSection = {
            label: charges.designation.toString().toUpperCase(),
            items: []
          }
          let travaux: NavItem[] = [];
          let lecons: NavItem[] = [];
          let examens: NavItem[] = [];
          let rattrapages: NavItem[] = [];


          // Attendre toutes les promesses pour chaque item
          await Promise.all(items.map(async (item : any) => {
            const repsdata = await titulaireService.getAnneeAcademique(item.anneeId._id)
            const anneeData = repsdata.data

            travaux = [
                ...travaux,
                {
                    title: `Travaux ${anneeData.fin}`,
                    url: `/travaux/${charges._id}_${item.anneeId._id}`
                }
            ]
            // lecons = [
            //     ...lecons,
            //     {
            //         title: `Lecon ${anneeData.fin}`,
            //         url: `/lecons/${charges._id}_${item.anneeId._id}`
            //     }
            // ]
            // examens = [
            //     ...examens,
            //     {
            //         title: `Examen ${anneeData.fin}`,
            //         url: `/examens/${charges._id}_${item.anneeId._id}`
            //     }
            // ]
            // rattrapages = [
            //     ...rattrapages,
            //     {
            //         title: `Rattrapage ${anneeData.fin}`,
            //         url: `/rattrapages/${charges._id}_${item.anneeId._id}`
            //     }
            // ]            

            menuItem.items = [
              {
                title: 'Travaux',
                icon: faClipboardList,
                items: travaux
              },
              // {
              //   title: 'Lecons',
              //   icon: faBookOpen,
              //   items: lecons
              // },
              // {
              //   title: 'Examens',
              //   icon: faTrophy,
              //   items: examens
              // },
              // {
              //   title: 'Rattrapages',
              //   icon: faUserPlus,
              //   items: rattrapages
              // }
            ]
          }))

          customMenu.push(menuItem)
        }))

        const fullNavData = [
          {
            icon: faHome,
            items: [
              {
                title: "Dashboard",
                url: "/",
                items: [],
                icon: faHome,
              }
            ]
          },
          ...customMenu
        ]

        set({ navData: fullNavData })
      },

      fetchChargesHoraire: async (titulaireId: string) => {
        try {
          set({ isLoading: true, error: null })
          const resp = await titulaireService.getChargesHoraireByTitulaireId(titulaireId)
          set({ chargesHoraire: resp.data, isLoading: false })
          await get().buildNavigation() // Attendre la construction du menu
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Une erreur est survenue", 
            isLoading: false 
          })
        }
      },

      setTravaux: (data: BannerTravail) => {
        set({ travaux: data })
      },

      updateTravaux: (travail: BannerTravail) => {
        set((state) => ({
          travaux: {
            ...state.travaux,
            ...travail
          }
        }))
      },

      resetError: () => set({ error: null })
    }),
    {
      name: 'titulaire-storage',
      partialize: (state) => ({ 
        chargesHoraire: state.chargesHoraire,
        navData: state.navData
      }),
      version: 1,
    }
  )
)