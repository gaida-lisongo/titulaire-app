"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSpinner, 
  faPlus, 
  faGavel,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import juryService from "@/api/juryService"; // À créer

interface Jury {
  _id: string;
  titre: string;
  secure: string;
  bureaux: Array<{
    grade: string;
    agentId: string;
  }>;
  promotions: string[];
  annees: string[];
}

export default function JurysPage() {
  const router = useRouter();
  const [jurys, setJurys] = useState<Jury[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newJury, setNewJury] = useState({
    titre: "",
    secure: "",
  });

  useEffect(() => {
    fetchJurys();
  }, []);

  const fetchJurys = async () => {
    try {
      const response = await juryService.getAllJurys();
      if (response.success) {
        setJurys(response.data);
      }
    } catch (error) {
      console.error("Error fetching jurys:", error);
      toast.error("Erreur lors du chargement des jurys");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJury = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await juryService.createJury(newJury);
      if (response.success) {
        toast.success("Jury créé avec succès");
        setIsModalOpen(false);
        fetchJurys();
      }
    } catch (error) {
      console.error("Error creating jury:", error);
      toast.error("Erreur lors de la création du jury");
    }
  };

  // Ajouter cette fonction de filtrage
  const filteredJurys = jurys.filter(jury =>
    jury.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header avec recherche */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Rechercher un jury..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nouveau Jury
        </button>
      </div>

      {/* Afficher un message si aucun résultat */}
      {filteredJurys.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Aucun jury ne correspond à votre recherche
        </div>
      )}

      {/* Grid des jurys filtrés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJurys.map((jury) => (
          <div
            key={jury._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push(`/jurys/${jury._id}`)}
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/images/logo/logo-inbtp.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                {jury.titre}
              </h3>
              <div className="flex justify-center items-center space-x-2 text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faGavel} />
                <span>{jury.bureaux.length} bureaux</span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
              <div className="flex justify-between text-sm">
                <span>{jury.promotions.length} promotions</span>
                <span>{jury.annees.length} années</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de création */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium mb-4">
              Nouveau Jury
            </Dialog.Title>

            <form onSubmit={handleCreateJury} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={newJury.titre}
                  onChange={(e) => setNewJury(prev => ({ ...prev, titre: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Mot de passe de délibération
                </label>
                <input
                  type="password"
                  value={newJury.secure}
                  onChange={(e) => setNewJury(prev => ({ ...prev, secure: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}