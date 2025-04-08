import { useMemo } from 'react'
import { useTitulaireStore } from '@/store/titulaireStore'
import { 
  faHome,
  faClipboardList,
  faBookOpen,
  faTrophy,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'

export const useNavData = () => {
  const chargesHoraire = useTitulaireStore((state) => state.chargesHoraire)

  const customMenu = useMemo(() => {
    let data = []

    chargesHoraire.forEach((charges) => {
      // ...votre logique existante de construction du menu...
    })

    return data
  }, [chargesHoraire])

  return [
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
}