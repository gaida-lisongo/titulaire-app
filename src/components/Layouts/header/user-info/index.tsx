"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useSectionStore } from "@/store/useSectionStore";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCog, 
  faSignOutAlt, 
  faWallet,
  faBuilding,
  faBank
} from '@fortawesome/free-solid-svg-icons';
import { useTitulaireStore } from "@/store/titulaireStore";
import titulaireService from "@/api/titulaireService";

// Dans le composant UserInfo, ajoutez l'import pour la modal
import { RetraitModal } from "@/components/Modals/retrait-modal";

export function UserInfo() {
  // Vos états actuels
  const [isOpen, setIsOpen] = useState(false);
  
  // Nouvel état pour contrôler la modal de retrait
  const [isRetraitModalOpen, setIsRetraitModalOpen] = useState(false);
  
  const router = useRouter();
  const { logout, agent  } = useAuthStore();
  const clearSections = useSectionStore((state) => state.clearSections);
  const { soldeTravaux, retraits, soldeRetraits, fetchRetraits } = useTitulaireStore();
  const [soldeDispoinible, setSoldeDisponible] = useState(0);
  const { createRetrait } = titulaireService

  useEffect(() => {
    const fetchData = async () => {
      if (agent?.id) {
        await fetchRetraits(agent.id);
      }
    };

    fetchData();
  }, []);
  
  useEffect(()=> {
    console.log("Retraits:", soldeRetraits);
    console.log("Travaux:", soldeTravaux);
    setSoldeDisponible((soldeTravaux ?? 0) - (soldeRetraits ?? 0));
  }, [retraits]);

  const handleLogout = () => {
    // Nettoyer le cookie d'authentification
    Cookies.remove('auth-token');
    
    // Nettoyer les stores
    logout();
    clearSections();
    
    setIsOpen(false);
    router.push('/auth');
  };

  // Modifiez la fonction handleRetrait pour ouvrir la modal au lieu de setIsOpen
  const handleRetrait = () => {
    setIsOpen(false); // Fermer le dropdown
    setIsRetraitModalOpen(true); // Ouvrir la modal de retrait
  };

  const handleCreateRetrait = async ({ montant }: { montant: number }) => {
    if (agent?.id) {
      const payload = {
        agentId: agent.id,
        montant: montant,
        type: "enseignant",
        description: "Retrait du solde des travaux",
      }
      try {
        const response = await createRetrait(payload)
        console.log("Response created retrait:", response);
        if (response.success) {
          // Rafraîchir les retraits et fermer la modal
          await fetchRetraits(agent.id);

          // window.alert("Retrait effectué avec succès");
          // window.location.reload();
        } 
      } catch (error) {
        console.error("Erreur lors du retrait:", error);
      } finally {
        setIsRetraitModalOpen(false);
      }
    }
  }

  const USER = agent ? {
    name: `${agent.nom} ${agent.prenom}`,
    email: agent.email,
    img: agent.avatar || "/images/user/user-03.png",
  } : {
    name: "Loading...",
    email: "",
    img: "/images/user/user-03.png",
  };

  return (
    <>
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
        <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
          <span className="sr-only">My Account</span>

          <figure className="flex items-center gap-3">
            <Image
              src={USER.img}
              className="size-12"
              alt={`Avatar of ${USER.name}`}
              role="presentation"
              width={200}
              height={200}
            />
            <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
              <span>{USER.name}</span>

              <ChevronUpIcon
                aria-hidden
                className={cn(
                  "rotate-180 transition-transform",
                  isOpen && "rotate-0",
                )}
                strokeWidth={1.5}
              />
            </figcaption>
          </figure>
        </DropdownTrigger>

        <DropdownContent
          className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
          align="end"
        >
          <h2 className="sr-only">User information</h2>

          <figure className="flex items-center gap-2.5 px-5 py-3.5">
            <Image
              src={USER.img}
              className="size-12"
              alt={`Avatar for ${USER.name}`}
              role="presentation"
              width={200}
              height={200}
            />

            <figcaption className="space-y-1 text-base font-medium">
              <div className="mb-2 leading-none text-dark dark:text-white">
                {USER.name}
              </div>

              <div className="leading-none text-gray-6">{USER.email}</div>
            </figcaption>
          </figure>

          <hr className="border-[#E8E8E8] dark:border-dark-3" />

          <div className="px-5 py-2">
            <h3 className="text-sm font-semibold text-gray-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faBank} />
              Solde disponible
            </h3>
            <p className="text-base font-medium text-dark dark:text-white">
            {(soldeTravaux ?? 0) - (soldeRetraits ?? 0)} FC
            </p>
          </div>

          <hr className="border-[#E8E8E8] dark:border-dark-3" />

          <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
            <button
              onClick={handleRetrait}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <FontAwesomeIcon icon={faWallet} className="text-xl" />
              <span className="mr-auto text-base font-medium">Faire un retrait</span>
            </button>

            <Link
              href={"/profile"}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <FontAwesomeIcon icon={faCog} />
              <span className="mr-auto text-base font-medium">
                Paramètres du compte
              </span>
            </Link>

            <Link
              href={"/pages/settings"}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <FontAwesomeIcon icon={faUser} />
              <span className="mr-auto text-base font-medium">Mon profil</span>
            </Link>
          </div>

          <hr className="border-[#E8E8E8] dark:border-dark-3" />

          <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
            <button
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="text-base font-medium">Se Déconnecter</span>
            </button>
          </div>
        </DropdownContent>
      </Dropdown>

      {/* Ajouter la modal de retrait */}
      <RetraitModal
        isOpen={isRetraitModalOpen}
        onClose={() => setIsRetraitModalOpen(false)}
        onSubmit={handleCreateRetrait}
        soldeDisponible={(soldeTravaux ?? 0) - (soldeRetraits ?? 0)}
      />
    </>
  );
}