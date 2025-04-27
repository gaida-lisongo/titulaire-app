"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTimes, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useTitulaireStore } from "@/store/titulaireStore";

interface RetraitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { montant: number }) => Promise<void>;
  soldeDisponible: number;
}

export function RetraitModal({ isOpen, onClose, onSubmit, soldeDisponible }: RetraitModalProps) {
  const [montant, setMontant] = useState<number | ''>('');
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation du montant
    if (!montant) {
      setError("Veuillez saisir un montant");
      return;
    }
    
    if (typeof montant === 'number' && montant <= 0) {
      setError("Le montant doit être supérieur à 0");
      return;
    }
    
    if (typeof montant === 'number' && montant > soldeDisponible) {
      setError("Le montant ne peut pas dépasser votre solde disponible");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await onSubmit({ montant: Number(montant) });
      // Réinitialiser le formulaire après soumission réussie
      setMontant('');
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors du traitement de votre demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => !loading && onClose()} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-bold text-dark dark:text-white">
              Faire un retrait
            </Dialog.Title>
            
            <button
              onClick={() => !loading && onClose()}
              className="text-gray-500 hover:text-dark dark:hover:text-white"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Solde disponible: <span className="font-semibold text-dark dark:text-white">{soldeDisponible.toLocaleString()} FC</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="montant" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Montant à retirer (FC)
              </label>
              
              <input
                type="number"
                id="montant"
                value={montant}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  setMontant(value);
                  setError("");
                }}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-boxdark dark:focus:border-primary"
                placeholder="Entrez le montant à retirer"
                disabled={loading}
                min="1"
                max={soldeDisponible}
              />
            </div>
            
            {error && (
              <div className="mb-4 flex items-center gap-2.5 rounded-md bg-red-50 py-3 px-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-stroke py-2 px-5 text-sm font-medium text-gray-6 hover:bg-gray-2 dark:border-dark-3 dark:text-gray-6 dark:hover:bg-meta-4"
                disabled={loading}
              >
                Annuler
              </button>
              
              <button
                type="submit"
                className="rounded-lg bg-primary py-2 px-5 text-sm font-medium text-white hover:bg-primary/90 disabled:bg-primary/70"
                disabled={loading || montant === '' || Number(montant) <= 0 || Number(montant) > soldeDisponible}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Traitement...
                  </span>
                ) : (
                  'Confirmer le retrait'
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}