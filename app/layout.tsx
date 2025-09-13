import './globals.css';
import './preload.css';
import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import { LoadingProvider } from '@/providers/LoadingProvider';
import { NavigationProvider } from '@/providers/NavigationProvider';
import { Analytics } from '@vercel/analytics/react';

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif']
});

const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: 'GEN 201 - Hackathon 2025',
  description: 'Creating the next generation - Join GEN 201 Hackathon organized by CSE (AI) Department',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${orbitron.variable} ${rajdhani.variable} font-orbitron bg-black text-white text-optimized`}>
        <LoadingProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </LoadingProvider>
        <Analytics />
      </body>
    </html>
  );
}