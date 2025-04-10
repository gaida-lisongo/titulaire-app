"use client"; // Important : marquer comme composant client

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Import dynamique du composant Signin
const Signin = dynamic(() => import("@/components/Auth/Signin"), {
  ssr: false, // Maintenant ok car nous sommes dans un composant client
  loading: () => <div className="text-center py-10">Chargement...</div>
});

export default function ClientSignin() {
  return <Signin />;
}