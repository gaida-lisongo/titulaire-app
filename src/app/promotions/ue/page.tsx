"use client";
import { useState, useEffect } from 'react';
import { usePromotionStore } from '@/store/usePromotionStore';
import { useSectionStore } from '@/store/useSectionStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { UEDataTable } from '@/components/Tables/ue/data-table';
import { UEModal } from '@/components/Modals/ue-modal';
import { toast } from 'react-hot-toast';
import { Select } from '@/components/ui/select';

export default function UEPage() {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId);
  });

  const { 
    promotions, 
    loading: loadingPromotions, 
    fetchPromotions,
    createUnite,
    updateUnite,
    deleteUnite,
    fetchUnites
  } = usePromotionStore();

  const [selectedPromotion, setSelectedPromotion] = useState<string>("");
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUE, setEditingUE] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filteredUnites, setFilteredUnites] = useState([]);

  // Sélectionner la première promotion par défaut
  useEffect(() => {
    if (promotions.length > 0 && !selectedPromotion) {
      setSelectedPromotion(promotions[0]._id);
    }
  }, [promotions]);

  // Charger les promotions au démarrage
  useEffect(() => {
    if (activeSection?._id) {
      fetchPromotions(activeSection._id);
    }
  }, [activeSection]);

  // Charger les unités quand une promotion est sélectionnée
  useEffect(() => {
    if (selectedPromotion) {
      fetchUnites(selectedPromotion);
    }
  }, [selectedPromotion]);

  // Filtrer les unités selon la recherche
  useEffect(() => {
    if (!selectedPromotion) return;
    
    const promotion = promotions.find(p => p._id === selectedPromotion);
    if (!promotion) return;

    const filtered = promotion.unites?.filter(ue => 
      ue.code.toLowerCase().includes(search.toLowerCase()) ||
      ue.designation.toLowerCase().includes(search.toLowerCase()) ||
      ue.categorie.toLowerCase().includes(search.toLowerCase())
    ) || [];

    setFilteredUnites(filtered);
    setCurrentPage(1);
  }, [selectedPromotion, promotions, search]);

  const handleAdd = () => {
    if (!selectedPromotion) {
      toast.error("Veuillez sélectionner une promotion");
      return;
    }
    setEditingUE(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ue) => {
    setEditingUE(ue);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!selectedPromotion || !confirm('Êtes-vous sûr de vouloir supprimer cette unité ?')) return;
    
    try {
      await deleteUnite(selectedPromotion, id);
      toast.success('Unité supprimée avec succès');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (data) => {
    console.log('Submitting data:', data);
    if (!selectedPromotion) return;

    try {
      if (editingUE) {
        await updateUnite(selectedPromotion, editingUE._id, data);
        toast.success('Unité d\'enseignement mise à jour avec succès');
      } else {
        await createUnite(selectedPromotion, data);
        toast.success('Unité d\'enseignement créée avec succès');
      }
      setIsModalOpen(false);
      // Recharger les unités après modification
      await fetchUnites(selectedPromotion);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur est survenue');
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUnites.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUnites.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Bannière */}
        <div className="relative h-[280px] overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0">
            <img
              src="/images/banner/admin-inbtp.jpeg"
              alt="UE Banner"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
          
          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                Unités d'Enseignement
              </h1>
              <p className="mt-4 text-lg text-gray-100 md:text-xl">
                Gérez les unités d'enseignement de vos promotions
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
              <div className="rounded-xl bg-white/10 backdrop-blur-lg p-4 text-white">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faBookOpen} className="text-2xl" />
                  <div>
                    <p className="text-sm opacity-80">Total UE</p>
                    <p className="text-2xl font-bold">
                      {selectedPromotion ? promotions.find(p => p._id === selectedPromotion)?.unites?.length || 0 : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section principale */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-lg blur opacity-30" />
          
          <div className="relative rounded-xl border border-stroke bg-white shadow-2xl dark:border-strokedark dark:bg-boxdark">
            <div className="p-6">
              {/* Sélecteur de promotion et recherche */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Select
                  value={selectedPromotion}
                  onChange={(value) => setSelectedPromotion(value)}
                  placeholder="Sélectionnez une promotion"
                  options={promotions.map(p => ({
                    value: p._id,
                    label: `${p.niveau} - ${p.mention}`
                  }))}
                  className="w-full sm:max-w-xs"
                />

                <div className="flex gap-4">
                  <div className="relative flex w-full max-w-md">
                    <input
                      type="text"
                      placeholder="Rechercher une UE..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-white/80 pl-4 pr-10 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>

                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 shadow-lg shadow-primary/50"
                  >
                    Nouvelle UE
                  </button>
                </div>
              </div>

              <UEDataTable
                data={currentItems}
                loading={loadingPromotions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>

        <UEModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          ue={editingUE}
          promotionId={selectedPromotion}
        />
      </div>
    </div>
  );
}