import './globals.css';
import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import { LoadingProvider } from '@/providers/LoadingProvider';
import { NavigationProvider } from '@/providers/NavigationProvider';

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700', '900']
});

const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'GEN 201 - Hackathon 2025',
  description: 'Creating the next generation - Join GEN 201 Hackathon organized by CSE (AI) Department',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${rajdhani.variable} font-orbitron bg-black text-white`}>
        <LoadingProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}