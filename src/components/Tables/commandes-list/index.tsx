"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr, se } from "date-fns/locale";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faGraduationCap, faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons';
import { usePromotionStore } from "@/store/usePromotionStore";
import { useSectionStore } from "@/store/useSectionStore";
import sectionService from "@/api/sectionService";
import titulaireService from "@/api/titulaireService";
import { useAuthStore } from "@/store/useAuthStore";
import { DropdownTravaux } from "./dropdown";
import { useTitulaireStore } from "@/store/titulaireStore";

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

export function CommandesList({ className }: { className?: string }) {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId);
  });
  const { agent } = useAuthStore();
  const { promotions, fetchPromotions } = usePromotionStore();
  const { fetchCommandes, soldeTravaux } = useTitulaireStore();
  const [selectedPromotion, setSelectedPromotion] = useState<string>("");
  const [selectedTravail, setSelectedTravail] = useState<string | null>(null);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(false);
  const [allTravaux, setAllTravaux] = useState<{
    _id: string;
    titre: string;
    montant: number;
    type: string;
  }[]>([]);
  const { getAllTravauxByAuteurId } = titulaireService;

  useEffect(() => {
    const fetchTravaux = async () => {
      if (!agent?.id) return;
      const request = await getAllTravauxByAuteurId(agent.id);

      const travaux = request.map((travail: any) => ({
          _id: travail._id,
          titre: travail.titre,
          montant: travail.montant,
          type: travail.type
        })
      ) 
      setAllTravaux(travaux);
      setSelectedTravail(travaux[0]?._id || null);
    }

    fetchTravaux();
  }, []);

  useEffect(() => {
    if (activeSection?._id) { 
      fetchPromotions(activeSection._id);
    }
  }, [activeSection, fetchPromotions]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTravail) return;
      
      setLoading(true);
      try {
        let response;
        
        // Si un travail spécifique est sélectionné
        if (selectedTravail) {
          response = await fetchCommandes(selectedTravail);
          
          if (response) {
            setCommandes(response);
          } else {
            console.error("Erreur lors de la récupération des commandes:", response);
          }
        } 
      } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedPromotion, selectedTravail]);

  const getProductColor = (product: string) => {
    return product.toLowerCase().includes('tp') 
      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
      : 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
  };

  const getProductIcon = (product: string) => {
    return product.toLowerCase().includes('tp') 
      ? faFileAlt 
      : faGraduationCap;
  };

  // Gestion de la réinitialisation des filtres
  const handleReset = () => {
    setSelectedPromotion("");
    setSelectedTravail(null);
    setCommandes([]);
  };

  if (!allTravaux) {
    return (
      <div className="flex h-60 items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary" />
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 sm:pb-4",
      className
    )}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-title-md2 font-bold text-dark dark:text-white">
            Liste des Commandes
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {commandes.length} commande(s) trouvée(s)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Dropdown pour les types de travaux */}
          <DropdownTravaux
            allTravaux={allTravaux}
            selectedTravail={selectedTravail}
            onSelect={setSelectedTravail}
            className="w-full sm:w-[250px]"
          />
          
          {/* Bouton de réinitialisation */}
          {(selectedPromotion || selectedTravail) && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary" />
        </div>
      ) : (
        <>
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-2 dark:bg-meta-4 [&>th]:!py-4 [&>th]:!font-semibold">
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[120px]">Étudiant</TableHead>
                  <TableHead className="min-w-[180px]">Titre</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-center min-w-[120px]">Référence</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {commandes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-gray-500">
                      {selectedPromotion || selectedTravail ? 
                        "Aucune commande trouvée pour les critères sélectionnés" : 
                        "Sélectionnez une promotion ou un type de travail pour afficher les commandes"}
                    </TableCell>
                  </TableRow>
                ) : (
                  commandes.map((commande) => (
                    <TableRow
                      key={commande._id}
                      className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-1 dark:hover:bg-meta-4"
                    >
                      <TableCell className="py-4">
                        {format(new Date(commande.date_created), 'PPP', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        {
                          commande.etudiant && 
                          <div className="flex flex-col">
                            <span className="font-medium">{commande.etudiant.infoPerso.nom} {commande.etudiant.infoPerso.postnom}</span>
                            <span className="text-xs text-gray-500">{commande.etudiant.infoSec.email}</span>
                          </div>
                        }
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{commande.title}</span>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                          commande.statut === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" :
                          commande.statut === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" :
                          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        )}>
                          {commande.statut}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {standardFormat(commande.montant)} {commande.monnaie}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-block rounded-full bg-gray-2 px-3 py-1 text-xs font-medium dark:bg-meta-4 truncate max-w-[150px]" title={commande.ref}>
                          {commande.ref.split("-")[2]}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {commandes.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <span>
                Total: {standardFormat(commandes.reduce((sum, cmd) => sum + cmd.montant, 0))} FC
              </span>
              <span>
                {commandes.length} résultat(s)
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}