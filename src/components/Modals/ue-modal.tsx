"use client";
import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// Ajoutez cette ligne pour importer toast
import { toast } from 'react-hot-toast';

interface UEInput {
  designation: string;
  code: string;
  description: string;
  filiere: string;
  credits: number;
  promotionId: string;
}

interface UE {
  _id?: string;
  designation: string;
  code: string;
  description: string;
  filiere: string;
  credits: number;
  promotionId: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UEInput) => Promise<void>;
  ue?: UE;
}

export function UEModal({ isOpen, onClose, onSubmit, ue }: Props) {
  const [form, setForm] = useState<UEInput>({
    designation: '',
    code: '',
    description: '',
    filiere: '',
    credits: 0,
    promotionId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ue) {
      setForm({
        designation: ue.designation,
        code: ue.code,
        description: ue.description,
        filiere: ue.filiere,
        credits: ue.credits,
        promotionId: ue.promotionId
      });
    } else {
      // Reset form when creating new
      setForm({
        designation: '',
        code: '',
        description: '',
        filiere: '',
        credits: 0,
        promotionId: ''
      });
    }
  }, [ue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {ue ? 'Modifier l\'unité d\'enseignement' : 'Nouvelle unité d\'enseignement'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code
              </label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Désignation
              </label>
              <input
                type="text"
                value={form.designation}
                onChange={e => setForm(prev => ({ ...prev, designation: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filière
              </label>
              <input
                type="text"
                value={form.filiere}
                onChange={e => setForm(prev => ({ ...prev, filiere: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Crédits
              </label>
              <input
                type="number"
                value={form.credits}
                onChange={e => setForm(prev => ({ ...prev, credits: Number(e.target.value) }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-70 hover:bg-primary/90"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : ue ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}