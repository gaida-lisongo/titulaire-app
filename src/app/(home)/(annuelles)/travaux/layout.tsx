'use client'

import { TravauxProvider } from './contexts/TravauxContext'

export default function TravauxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TravauxProvider>{children}</TravauxProvider>
}