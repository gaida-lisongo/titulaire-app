import { 
  faHome, 
  faGraduationCap, 
  faUserTie,
  faClipboardList,
  faUsers,
  faClock,
  faCalendarAlt,
  faBookOpen,
  faUserGraduate,
  faFileAlt,
  faChalkboardTeacher,
  faTrophy,
  faPencilAlt,
  faCode,
  faUserPlus,
  faListAlt
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavItem {
  title: string;
  url?: string;
  icon?: IconDefinition;
  items?: NavItem[]; 
}

interface NavSection {
  label?: string;
  icon?: IconDefinition;
  items: NavItem[];
}

// Fonction qui prend les charges horaires en paramètre au lieu de les récupérer directement via useTitulaireStore
interface ChargeHoraire {
  designation: string;
  charges_horaires: Array<{
    anneeId: string;
    travaux: string[];
    lecons: string[];
    examens: string[];
    rattrapages: string[];
  }>;
}

export const generateMenuFromCharges = (chargesHoraire: ChargeHoraire[] = []) => {
  let data: NavSection[] = [];

  chargesHoraire.forEach((charges) => {
    const items = charges.charges_horaires
    let menuItem: any = {
      label: charges.designation.toString().toUpperCase(),
    }
    let travaux: NavItem[] = [];
    let lecons: NavItem[] = [];
    let examens: NavItem[] = [];
    let rattrapages: NavItem[] = [];

    items.forEach((item) => {
      travaux = item.travaux.map((travail, idx) => {
        return {
          title: `Travail ${idx + 1}`,
          url: `/travaux/${travail}_${item.anneeId}`
        }
      })

      lecons = item.lecons.map((lecon, idx) => {
        return {
          title: `Lecon ${idx + 1}`,
          url: `/lecons/${lecon}_${item.anneeId}`
        }
      })

      examens = item.examens.map((examen, idx) => {
        return {
          title: `Examen ${idx + 1}`,
          url: `/examens/${examen}_${item.anneeId}`
        }
      })

      rattrapages = item.rattrapages.map((rattrapage, idx) => {
        return {
          title: `Rattrapage ${idx + 1}`,
          url: `/rattrapages/${rattrapage}_${item.anneeId}`
        }
      })
    })

    menuItem.items = [
      {
        title: 'Travaux',
        icon: faClipboardList,
        items: travaux
      },
      {
        title: 'Lecons',
        icon: faBookOpen,
        items: lecons
      },
      {
        title: 'Examens',
        icon: faTrophy,
        items: examens
      },
      {
        title: 'Rattrapages',
        icon: faUserPlus,
        items: rattrapages
      }
    ];

    data.push(menuItem);
  });

  return data;
}

// Menu par défaut qui sera enrichi dans le composant qui utilise ce module
export const DEFAULT_NAV_DATA: NavSection[] = [
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
  }
];

// Fonction pour créer le menu complet avec les données dynamiques
export const createFullNavData = (chargesHoraire = []) => {
  const customMenu = generateMenuFromCharges(chargesHoraire);
  return [
    ...DEFAULT_NAV_DATA,
    ...customMenu
  ];
};
