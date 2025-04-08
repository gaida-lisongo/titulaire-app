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
import { useTitulaireStore } from '@/store/titulaireStore';
import { url } from 'inspector';
import { title } from 'process';

const { chargesHoraire } = useTitulaireStore((state) => state);

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

const charges = () => {
  let data = [] 

  chargesHoraire.forEach((charges) => {
    const items = charges.charges_horaires
    let menuItem = {
      label: charges.designation.toString().toUpperCase(),
    }
    let travaux = [];
    let lecons = [];
    let examens = [];
    let rattrapages = [];

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

const customMenu = charges();

export const NAV_DATA: NavSection[] = [
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
];
