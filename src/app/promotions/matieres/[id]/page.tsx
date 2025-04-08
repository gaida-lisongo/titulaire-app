"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUserGraduate,
  faSearch,
  faBookOpen,
  faCalendarDays,
  faPen,
  faTrash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import sectionService from '@/api/sectionService';
import agentService from '@/api/agentService';

interface Enseignant {
  _id: string;
  nom: string;
  prenom: string;
}

interface Annee {
  _id: string;
  slogan: string;
  debut: number;
  fin: number;
}

interface ChargeHoraire {
  _id: string;
  lecons: string[];
  travaux: string[];
  examens: string[];
  rattrapages: string[];
  anneeId: {
    _id: string;
    slogan: string;
    debut: number;
    fin: number;
    createdAt: string;
    updatedAt: string;
  };
  titulaire: {
    _id: string;
    nom: string;
    prenom: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function MatiereDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  
  const [matiere] = useState({
    _id: id,
    code: searchParams.get('code'),
    designation: searchParams.get('designation'),
    credit: parseInt(searchParams.get('credit') || '0'),
    semestre: searchParams.get('semestre'),
    codeUnite: searchParams.get('codeUnite')
  });

  const [loading, setLoading] = useState(true);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [annees, setAnnees] = useState<Annee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState<string>('');
  const [charges, setCharges] = useState<ChargeHoraire[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enseignantsRes, anneesRes, chargesRes] = await Promise.all([
          agentService.getAllAgents(),
          agentService.getAllAnnees(),
          sectionService.getChargesHoraires(id)
        ]);

        if (enseignantsRes.success) setEnseignants(enseignantsRes.data);
        if (anneesRes.success) {
          const triAnnees = anneesRes.data.sort((a: Annee, b: Annee) => b.debut - a.debut);
          setAnnees(triAnnees);
          if (triAnnees.length > 0) {
            setSelectedAnnee(triAnnees[0]._id);
          }
        }
        if (chargesRes.success && chargesRes.data.data) { // Check for data existence
          setCharges(chargesRes.data.data); // Access the correct data path
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSelectEnseignant = async (enseignantId: string) => {
    if (!selectedAnnee) return;

    setLoading(true);
    try {
      const response = await sectionService.createChargeHoraire(id, {
        anneeId: selectedAnnee,
        titulaire: enseignantId
      });

      if (response.success) {
        // Récupérer l'année et l'enseignant correspondants
        const annee = annees.find(a => a._id === selectedAnnee);
        const enseignant = enseignants.find(e => e._id === enseignantId);

        // Créer une nouvelle charge horaire avec la structure correcte
        const newCharge: ChargeHoraire = {
          _id: response.data.charges_horaires[response.data.charges_horaires.length - 1]._id,
          lecons: [],
          travaux: [],
          examens: [],
          rattrapages: [],
          anneeId: {
            _id: selectedAnnee,
            slogan: annee?.slogan || '',
            debut: annee?.debut || 0,
            fin: annee?.fin || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          titulaire: {
            _id: enseignantId,
            nom: enseignant?.nom || '',
            prenom: enseignant?.prenom || ''
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setCharges(prev => [...prev, newCharge]);
        toast.success('Charge horaire attribuée avec succès');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erreur lors de l'attribution");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chargeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette charge horaire ?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await sectionService.deleteChargeHoraire(id, chargeId);
      
      if (response.success) {
        // Filtrer la charge horaire supprimée du state
        setCharges(prev => prev.filter(charge => charge._id !== chargeId));
        toast.success('Charge horaire supprimée avec succès');
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erreur lors de la suppression de la charge horaire");
    } finally {
      setLoading(false);
    }
  };

  const filteredEnseignants = enseignants.filter(e => 
    `${e.nom} ${e.prenom}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bannière */}
        <div className="relative h-[200px] overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="relative z-10 h-full flex flex-col justify-between p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {matiere.designation}
                </h1>
                <p className="mt-2 text-lg text-gray-100">
                  {matiere.code} - {matiere.credit} crédits - {matiere.semestre} semestre
                </p>
              </div>
              <Link
                href="/promotions/matieres"
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Retour à la liste
              </Link>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Tabs defaultValue={annees[0]?._id} className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
              {annees.map(annee => (
                <TabsTrigger
                  key={annee._id}
                  value={annee._id}
                  onClick={() => setSelectedAnnee(annee._id)}
                  className="px-4 py-2"
                >
                  {annee.debut}-{annee.fin}
                </TabsTrigger>
              ))}
            </TabsList>

            {annees.map(annee => (
              <TabsContent key={annee._id} value={annee._id} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Liste des enseignants */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher un enseignant..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>

                    <div className="h-[500px] overflow-y-auto space-y-2 pr-2">
                      {filteredEnseignants.map(enseignant => {
                        const isAssigned = charges.some(
                          charge => charge.anneeId._id === annee._id && 
                          charge.titulaire._id === enseignant._id
                        );

                        return (
                          <button
                            key={enseignant._id}
                            onClick={() => handleSelectEnseignant(enseignant._id)}
                            disabled={isAssigned}
                            className={`w-full text-left p-4 rounded-lg transition-colors ${
                              isAssigned
                                ? 'bg-primary/10 text-primary border-2 border-primary'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUserGraduate} />
                              </div>
                              <div>
                                <div className="font-medium">{enseignant.nom}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {enseignant.prenom}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Détails de la charge horaire */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-6">Charge horaire actuelle</h3>
                    {charges.filter(charge => charge.anneeId._id === annee._id)
                      .map(charge => (
                        <div 
                          key={charge._id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUserGraduate} className="text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  {charge.titulaire.nom} {charge.titulaire.prenom}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {charge.titulaire.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(charge)}
                                className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                              >
                                <FontAwesomeIcon icon={faPen} />
                              </button>
                              <button
                                onClick={() => handleDelete(charge._id)}
                                className="p-2 text-red-600 hover:text-red-800 dark:text-red-400"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="text-sm font-medium mb-2">Leçons</h4>
                              <p className="text-2xl font-bold">{charge.lecons.length}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="text-sm font-medium mb-2">Travaux</h4>
                              <p className="text-2xl font-bold">{charge.travaux.length}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="text-sm font-medium mb-2">Examens</h4>
                              <p className="text-2xl font-bold">{charge.examens.length}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="text-sm font-medium mb-2">Rattrapages</h4>
                              <p className="text-2xl font-bold">{charge.rattrapages.length}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    {!charges.some(charge => charge.anneeId._id === annee._id) && (
                      <div className="text-center py-12 text-gray-500">
                        <FontAwesomeIcon icon={faUserGraduate} className="text-4xl mb-4" />
                        <p>Aucune charge horaire assignée pour cette année</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}