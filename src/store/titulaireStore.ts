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
import { tr } from 'date-fns/locale'

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

interface Commande {
  _id: string;
  date_created: string;
  product: string;
  montant: number;
  ref: string;
  statut: string;
  title: string;
  description: string;
  monnaie: string;
  etudiant: {
    infoPerso: {
      nom: string;
      prenom: string;
      postnom: string;
    };
    infoSec: {
      email: string;
      telephone: string;
    };
    _id: string;
  };
  [key: string]: any; // Pour d'autres propriétés dynamiques
}

interface Retrait {
  _id: string;
  montant: number;
  type: string;
  statut: 'completed' | 'pending';
  date_created: string;
  agentId: {
    nom: string;
    prenom: string;
    email: string;
    _id: string;
  };
}

interface Transaction {
  travailId: string
  commandes: Commande[]
  total: number
}

interface TitulaireState {
  chargesHoraire: any[]
  travaux: BannerTravail | null
  soldeTravaux: number | null
  transactions: Transaction[]
  selectedTravail: string | null
  soldeRetraits: number | null
  retraits: Retrait[]
  navData: NavSection[]
  isLoading: boolean
  error: string | null
  setSelectedTravail: (travailId: string) => void
  setSoldeRetraits: (solde: number) => void
  setTransactions: (transactions: Transaction[]) => void
  setSoldeTravaux: (solde: number) => void
  fetchCommandes: (titulaireId: string) => Promise<Commande[]>
  fetchChargesHoraire: (titulaireId: string) => Promise<void>
  fetchRetraits: (titulaireId: string) => Promise<void>
  setRetraits: (retraits: Retrait[]) => void
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
      selectedTravail: null,
      soldeRetraits: null,
      transactions: [],
      retraits: [],
      navData: [],
      isLoading: false,
      soldeTravaux: null,
      error: null,
      setSoldeRetraits: (solde) => {
        set({ soldeRetraits: solde })
      },
      setRetraits: (retraits) => {
        set({ retraits })
      },
      fetchRetraits: async (titulaireId: string) => { 
        try {
          set({ error: null })
          const resp = await titulaireService.retraitsByAgnetId(titulaireId)
          set({ soldeRetraits: resp.global.totalAmount })
          set({ retraits: resp.recent })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Une erreur est survenue", 
            isLoading: false 
          })
        }
      },

      setSoldeTravaux(solde) {
        set({ soldeTravaux: solde })
      },
      setSelectedTravail(travailId) {
        set({ selectedTravail: travailId })
      },
      setTransactions(transactions) {
        set({ transactions })
      },
      fetchCommandes: async (travailId) => {
        try {
          set({ error: null })
          const resp = await titulaireService.getCommandesByTravailId(travailId)
          console.log("Commandes:", resp)
          let commandesData : Commande[] = [];

          resp.forEach((commande: Commande) => {
            // S'assurer que commande.ref n'est pas en double
            if (!commande.etudiant) return; // Ignorer si etudiant est null ou undefined
            if (commandesData) {
              if (!commandesData.some((c: Commande) => c.etudiant._id === commande.etudiant._id)) {
                commandesData.push(commande);
              }
            }

          })

          if (commandesData.length > 0) {
            let soldes = 0;
            commandesData.forEach((commande: Commande) => {
              if (commande.statut == 'completed') { 
                const existingTransaction = get().transactions.find((transaction) => transaction.travailId === travailId)      
                
                if (!existingTransaction) {
                  soldes += commande.montant * 0.8 * commandesData.length
                  set((state) => ({
                    transactions: [
                      ...state.transactions,
                      {
                        travailId,
                        commandes: [commande],
                        total: commande.montant 
                      }
                    ]
                  }))
                }
              }
            })
            set({ soldeTravaux: (get().soldeTravaux || 0) + soldes })
          }
          return commandesData
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Une erreur est survenue", 
          })
          return []
        }
      },
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