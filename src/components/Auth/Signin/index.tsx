"use client";
import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";
// Modifier l'import du router
import { useRouter, useSearchParams } from "next/navigation"; // Utiliser next/navigation au lieu de next/router
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function Signin() {
  const router = useRouter();
  // Utiliser useSearchParams hook au lieu de new URLSearchParams()
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  // Récupérer le callbackUrl s'il existe
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  useEffect(() => {
    // Si l'utilisateur est déjà authentifié, le rediriger
    if (isAuthenticated) {
      router.push(decodeURI(callbackUrl));
    }
  }, [isAuthenticated, router, callbackUrl]);

  return (
    <>

      <div>
        <SigninWithPassword />
      </div>
    </>
  );
}
