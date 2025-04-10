import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import ClientSignin from "./components/ClientSignin"; // Importer un composant client

export const metadata: Metadata = {
  title: "Connectez-vous à votre compte",
  description: "Connectez-vous à votre compte pour accéder à toutes les fonctionnalités de l'application.",
};

export default function SignIn() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="rounded-lg bg-white shadow-md overflow-hidden">
        <div className="flex flex-wrap">
          {/* Colonne de gauche - Formulaire de connexion */}
          <div className="w-full lg:w-1/2">
            <div className="p-6 md:p-8 lg:p-10">
              <Suspense fallback={<div className="text-center py-10">Chargement...</div>}>
                <ClientSignin />
              </Suspense>
            </div>
          </div>

          {/* Colonne de droite - Image et texte */}
          <div className="hidden lg:block lg:w-1/2">
            <div className="relative h-full min-h-[500px]">
              {/* Image de fond */}
              <Image
                src="/images/banner/admin-inbtp.jpeg"
                alt="Plateforme enseignants INBTP"
                fill
                className="object-cover"
                priority
              />
              
              {/* Overlay pour améliorer la lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
              
              {/* Contenu informatif */}
              <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                <h2 className="text-2xl font-bold mb-3">
                  Plateforme des Enseignants INBTP
                </h2>
                
                <p className="mb-4 text-gray-100">
                  Un outil complet pour gérer efficacement vos cours et évaluations
                </p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="mr-2 h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Créez et gérez des travaux interactifs</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Évaluez les soumissions des étudiants</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Suivez les performances académiques</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
