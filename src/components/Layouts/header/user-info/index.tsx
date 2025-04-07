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
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCog, 
  faSignOutAlt, 
  faWallet,
  faBuilding 
} from '@fortawesome/free-solid-svg-icons';

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const clearSections = useSectionStore((state) => state.clearSections);
  const agent = useAuthStore((state) => state.agent);
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    console.log('Sections:', sections);
    console.log('Active Section ID:', activeSectionId);
    return sections.find(s => s._id === activeSectionId);
  });

  const handleLogout = () => {
    // Nettoyer le cookie d'authentification
    Cookies.remove('auth-token');
    
    // Nettoyer les stores
    logout();
    clearSections();
    
    setIsOpen(false);
    router.push('/auth/sign-in');
  };

  const handleRetrait = () => {
    console.log("Action: Demande de retrait initiée");
    console.log("Section active:", activeSection?.designation);
    setIsOpen(false);
  };

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
            <FontAwesomeIcon icon={faBuilding} />
            Section Active
          </h3>
          <p className="text-base font-medium text-dark dark:text-white">
            {activeSection?.titre || "Aucune section"}
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
            <FontAwesomeIcon icon={faUser} />
            <span className="mr-auto text-base font-medium">Mon profil</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <FontAwesomeIcon icon={faCog} />
            <span className="mr-auto text-base font-medium">
              Paramètres du compte
            </span>
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
  );
}
