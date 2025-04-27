"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFilter, faCheck } from '@fortawesome/free-solid-svg-icons';
import { cn } from "@/lib/utils";

interface DropdownTravauxProps {
  allTravaux: Array<{
    _id: string;
    titre: string;
    montant: number;
    type: string;
  }>;
  selectedTravail: string | null;
  onSelect: (travailId: string | null) => void;
  className?: string;
}

export function DropdownTravaux({ 
  allTravaux, 
  selectedTravail, 
  onSelect, 
  className 
}: DropdownTravauxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [travailTypes, setTravailTypes] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extraire les types uniques de travaux
  useEffect(() => {
    if (allTravaux && allTravaux.length > 0) {
      const uniqueTypes = [...new Set(allTravaux.map(travail => travail.type))];
      setTravailTypes(uniqueTypes);
    }
  }, [allTravaux]);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 console.log("Selected travail:", selectedTravail);
  // Obtenir le titre du travail sélectionné
  const getSelectedTypeName = () => {
    const travail = allTravaux.find(t => t._id === selectedTravail);
    return travail ? travail.titre : 'Tous les types';
  };

  // Filtrer les travaux par type
  const getTravauxByType = (type: string) => {
    return allTravaux.filter(travail => travail.type === type);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 text-left outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
      >
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faFilter} className="text-gray-500 dark:text-gray-400" />
          <span>{getSelectedTypeName()}</span>
        </div>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "")} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-boxdark">
          <div className="max-h-60 overflow-y-auto py-2">
            {/* Option pour tous les travaux */}
            <button
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-meta-4"
            >
              <span>Tous les types</span>
              {selectedTravail === null && <FontAwesomeIcon icon={faCheck} className="text-primary" />}
            </button>
            
            {/* Grouper par type de travail */}
            {travailTypes.map((type) => (
              <div key={type}>
                <div className="border-t border-gray-100 dark:border-dark-3 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  {type}
                </div>
                {getTravauxByType(type).map((travail) => (
                  <button
                    key={travail._id}
                    onClick={() => {
                      onSelect(travail._id);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-meta-4"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{travail.titre}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {travail.montant.toLocaleString()} FC
                      </span>
                    </div>
                    {selectedTravail === travail._id && (
                      <FontAwesomeIcon icon={faCheck} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}