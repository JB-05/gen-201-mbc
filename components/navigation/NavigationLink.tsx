'use client';

import { useRouter } from 'next/navigation';
import { useLoading } from '@/providers/LoadingProvider';

interface NavigationLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'link' | 'button';
  onClick?: () => void;
}

export function NavigationLink({ 
  href, 
  className, 
  children, 
  variant = 'link',
  onClick 
}: NavigationLinkProps) {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    
    console.log('NavigationLink clicked:', href); // Debug log
    
    // Execute any additional onClick handler
    onClick?.();
    
    // Check if it's an external URL
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    
    if (isExternal) {
      console.log('Opening external URL:', href); // Debug log
      // For external URLs, open in new tab
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      console.log('Navigating to internal URL:', href); // Debug log
      // For internal URLs, show loading screen and navigate
      setIsLoading(true);
      
      // Small delay to ensure loading screen appears
      await new Promise(resolve => setTimeout(resolve, 50));
      router.push(href);
    }
  };

  const linkClassName = variant === 'button' 
    ? `inline-block ${className}`
    : className;

  return (
    <a href={href} onClick={handleClick} className={linkClassName}>
      {children}
    </a>
  );
}