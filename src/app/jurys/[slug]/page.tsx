"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faUserGraduate,
  faCalendarDays,
  faChevronLeft,
  faUsers,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { Tab } from "@headlessui/react";
import { toast } from "react-hot-toast";
import juryService from "@/api/juryService";
import agentService from "@/api/agentService";
import sectionService from "@/api/sectionService";
import { useSectionStore } from "@/store/useSectionStore";

interface Bureau {
  grade: string;
  agentId: string;
}

interface Agent {
  _id: string;
  nom: string;
  prenom: string;
}

interface Promotion {
  _id: string;
  description: string;
  niveau: string;
}

interface Annee {
  _id: string;
  debut: number;
  fin: number;
}

interface Jury {
  _id: string;
  titre: string;
  secure: string;
  bureaux: Bureau[];
  promotions: string[];
  annees: string[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function JuryDetailPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [jury, setJury] = useState<Jury | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [annees, setAnnees] = useState<Annee[]>([]);
  const [loading, setLoading] = useState(true);
  const [bureauxMembers, setBureauxMembers] = useState<Bureau[]>([]);
  const [newBureau, setNewBureau] = useState({ grade: '', agentId: '' });
  const section = useSectionStore().activeSectionId
  console.log("Section ID:", slug);
  // État pour les sélections
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);
  const [selectedAnnees, setSelectedAnnees] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (jury) {
      setBureauxMembers(jury.bureaux);
    }
  }, [jury]);

  const fetchData = async () => {
    try {
      const [juryRes, agentsRes, promotionsRes, anneesRes] = await Promise.all([
        juryService.getJuryById(slug),
        agentService.getAllAgents(),
        sectionService.getAllPromotions(section),
        agentService.getAllAnnees(),
      ]);

      if (juryRes.success) {
        setJury(juryRes.data);
        setSelectedPromotions(juryRes.data.promotions);
        setSelectedAnnees(juryRes.data.annees);
      }
      if (agentsRes.success) setAgents(agentsRes.data);
      if (promotionsRes.success) setPromotions(promotionsRes.data);
      if (anneesRes.success) setAnnees(anneesRes.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    if (!newBureau.grade || !newBureau.agentId) return;

    // Vérifier si le grade existe déjà
    if (bureauxMembers.some(member => member.grade === newBureau.grade)) {
      toast.error("Ce grade est déjà attribué");
      return;
    }

    // Ajouter le nouveau membre à l'array local
    setBureauxMembers(prev => [...prev, newBureau]);
    setNewBureau({ grade: '', agentId: '' });
  };

  const handleRemoveMember = (index: number) => {
    setBureauxMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveBureau = async () => {
    if (!jury) return;

    try {
      const response = await juryService.updateJury(jury._id, {
        ...jury,
        bureaux: bureauxMembers
      });

      if (response.success) {
        toast.success("Bureau mis à jour avec succès");
        fetchData();
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du bureau");
    }
  };

  const handleUpdatePromotions = async () => {
    if (!jury) return;
    try {
      const response = await juryService.updateJury(jury._id, {
        ...jury,
        promotions: selectedPromotions
      });
      if (response.success) {
        toast.success("Promotions mises à jour");
        fetchData();
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des promotions");
    }
  };

  const handleUpdateAnnees = async () => {
    if (!jury) return;
    try {
      const response = await juryService.updateJury(jury._id, {
        ...jury,
        annees: selectedAnnees
      });
      if (response.success) {
        toast.success("Années mises à jour");
        fetchData();
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des années");
    }
  };

  if (loading || !jury) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{jury.titre}</h1>
            <p className="text-gray-500 dark:text-gray-400">Configuration du jury</p>
          </div>
          <button
            onClick={() => router.push('/jurys')}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            Retour
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary/10 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-primary shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
              )
            }
          >
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            Bureau
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-primary shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
              )
            }
          >
            <FontAwesomeIcon icon={faUserGraduate} className="mr-2" />
            Promotions
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-primary shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
              )
            }
          >
            <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
            Années
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-4">
          {/* Panel Bureau */}
          <Tab.Panel className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Grade</label>
                  <select
                    value={newBureau.grade}
                    onChange={(e) => setNewBureau(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700"
                  >
                    <option value="">Sélectionner un grade</option>
                    <option value="Président">Président</option>
                    <option value="Secrétaire">Secrétaire</option>
                    <option value="Membre">Membre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Agent</label>
                  <select
                    value={newBureau.agentId}
                    onChange={(e) => setNewBureau(prev => ({ ...prev, agentId: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700"
                  >
                    <option value="">Sélectionner un agent</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>
                        {agent.nom} {agent.prenom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddMember}
                disabled={!newBureau.grade || !newBureau.agentId}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                Ajouter au bureau
              </button>

              <div className="mt-6 space-y-4">
                {bureauxMembers.map((bureau, index) => {
                  const agent = agents.find(a => a._id === bureau.agentId);
                  return (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">{bureau.grade}</p>
                        <p className="text-sm text-gray-500">
                          {agent ? `${agent.nom} ${agent.prenom}` : 'Agent non trouvé'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {bureauxMembers.length > 0 && (
                <button
                  onClick={handleSaveBureau}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Enregistrer les modifications
                </button>
              )}
            </div>
          </Tab.Panel>

          {/* Panel Promotions */}
          <Tab.Panel className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {promotions.map(promotion => (
                <label key={promotion._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedPromotions.includes(promotion._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPromotions(prev => [...prev, promotion._id]);
                      } else {
                        setSelectedPromotions(prev => prev.filter(id => id !== promotion._id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>{promotion.description}</span>
                </label>
              ))}
              <button
                onClick={handleUpdatePromotions}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Mettre à jour les promotions
              </button>
            </div>
          </Tab.Panel>

          {/* Panel Années */}
          <Tab.Panel className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {annees.map(annee => (
                <label key={annee._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedAnnees.includes(annee._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAnnees(prev => [...prev, annee._id]);
                      } else {
                        setSelectedAnnees(prev => prev.filter(id => id !== annee._id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>{annee.debut}-{annee.fin}</span>
                </label>
              ))}
              <button
                onClick={handleUpdateAnnees}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Mettre à jour les années
              </button>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}