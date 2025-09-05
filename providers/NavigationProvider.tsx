'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useLoadingScreen } from '@/hooks/useLoadingScreen';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { showLoading } = useLoadingScreen();

  // Show loading screen only on initial load
  useEffect(() => {
    if (pathname === '/') {
      showLoading();
    }
  }, []); // Empty dependency array for initial load only

  return <>{children}</>;
}