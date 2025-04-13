// hooks/useRequireAuth.ts
'use client'

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/auth?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, pathname]);

  return { isAuthenticated };
}