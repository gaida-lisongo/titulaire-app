'use client';

import { Header } from "@/components/Layouts/header"
import { Sidebar } from "@/components/Layouts/sidebar"
import { Providers } from "./providers"
import NextTopLoader from "nextjs-toploader"
import { useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useTitulaireStore } from "@/store/titulaireStore"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const agent = useAuthStore((state) => state.agent)
  const { fetchChargesHoraire, navData, isLoading } = useTitulaireStore()
  console.log("Agent: ", navData)

  useEffect(() => {
    if (agent?.id) {
      fetchChargesHoraire(agent.id)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-2 dark:bg-[#020d1a]">
        <div className="loader"></div>
      </div>
    )
  }

  return (    
    <Providers>
      <NextTopLoader color="#5750F1" showSpinner={false} />

      <div className="flex min-h-screen">
        <Sidebar NAV_DATA={navData} />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />
          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  )
}