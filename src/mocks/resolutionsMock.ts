export const mockResolutions = [
  {
    _id: 'res_1',
    nom: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    matricule: '20M2203',
    etudiantId: 'etd_1',
    url: 'https://someurl.com/resolution1.pdf',
    travailId: '67f54de8abca24463f8add28',
    date_creation: new Date('2025-04-08T10:30:00'),
    note: 15,
    commentaire: 'Bon travail, quelques erreurs mineures'
  },
  {
    _id: 'res_2',
    nom: 'Alice Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    matricule: '21M2105',
    etudiantId: 'etd_2',
    url: 'https://someurl.com/resolution2.pdf',
    travailId: '67f54de8abca24463f8add28',
    date_creation: new Date('2025-04-08T11:15:00'),
    note: null,
    commentaire: ''
  },
  {
    _id: 'res_3',
    nom: 'Bob Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    matricule: '19M2198',
    etudiantId: 'etd_3',
    url: 'https://someurl.com/resolution3.pdf',
    travailId: '67f54de8abca24463f8add28',
    date_creation: new Date('2025-04-08T09:45:00'),
    note: 12,
    commentaire: 'Peut mieux faire'
  }
]

export const mockTravail = {
  _id: '67f54de8abca24463f8add28',
  titre: 'Exercice sur les fonctions',
  description: 'Résoudre les problèmes de fonctions',
  type: 'QCM',
  matiereId: '67ee1b1d25946fcbfa91a43f',
  matiere: {
    designation: 'Mathématiques',
    code: 'MATH101'
  },
  date_fin: new Date('2025-04-10T10:25:00.000Z'),
  auteurId: '67ed49817a4cb443b9a7cc08',
  montant: 750,
  statut: 'EN COURS',
  questions: [
    {
      _id: '67f552bbabca24463f8add38',
      enonce: 'Question 1',
      type: 'QCM',
      choix: ['Choix 1', 'Choix 2', 'Choix 3']
    },
    {
      _id: '67f552bbabca24463f8add39',
      enonce: 'Question 2',
      type: 'QCM',
      choix: ['Choix A', 'Choix B', 'Choix C']
    }
  ]
}