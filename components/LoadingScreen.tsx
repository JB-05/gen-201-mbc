'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLoading } from '@/providers/LoadingProvider';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Systems');
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const loadingTexts = [
      'Initializing Systems',
      'Establishing Neural Links',
      'Synchronizing Data Streams',
      'Calibrating AI Modules',
      'Loading Virtual Environment'
    ];

    let currentTextIndex = 0;
    const textInterval = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[currentTextIndex]);
    }, 1000);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + 2, 100);
      });
    }, 20);

    // Force complete after max duration
    const maxDuration = setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, 3000);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
      clearTimeout(maxDuration);
    };
  }, [setIsLoading]);

  // Auto-hide when progress reaches 100%
  useEffect(() => {
    if (progress === 100) {
      const hideDelay = setTimeout(() => {
        setIsLoading(false);
      }, 500); // Short delay to show 100%

      return () => clearTimeout(hideDelay);
    }
  }, [progress, setIsLoading]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black p-4 sm:p-6">
      {/* Neural Network Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-futuristic opacity-30" />
        <div className="scan-line" />
      </div>

      {/* Main Title */}
      <div className="relative mb-4 sm:mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7303c0] to-[#928dab] animate-pulse">
          GEN 201
        </h1>
      </div>

      {/* Loading Text with Glitch Effect */}
      <div className="mb-4 sm:mb-6 text-center px-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-orbitron text-[#7303c0] glitch whitespace-normal">
          {loadingText}
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="w-[80%] sm:w-64 h-1.5 sm:h-2 bg-black/50 rounded-full overflow-hidden border border-[#7303c0] relative">
        <div
          className="h-full bg-gradient-to-r from-[#7303c0] to-[#928dab] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7303c0]/20 to-transparent animate-[flowingLine_2s_linear_infinite]" />
      </div>

      {/* Progress Percentage */}
      <div className="mt-2 sm:mt-4">
        <span className="font-mono text-[#928dab] text-xs sm:text-sm">
          {progress}% Complete
        </span>
      </div>

      {/* Hexagon Grid Background - Optimized for mobile */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg width="100%" height="100%" className="scale-[1.5] sm:scale-100">
          <pattern
            id="hexagons"
            width="25"
            height="21.7"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(2) rotate(0)"
          >
            <path
              d="M12.5,0 L25,7.15 L25,14.55 L12.5,21.7 L0,14.55 L0,7.15 Z"
              fill="none"
              stroke="#7303c0"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* UgeniX Logo in bottom right - Responsive sizing */}
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10">
        <div className="relative w-16 h-16 sm:w-24 sm:h-24 opacity-80 hover:opacity-100 transition-opacity">
          <Image
            src="/assets/ugenix.svg"
            alt="UgeniX Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Mobile-optimized scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7303c0]/5 to-transparent opacity-20"
          style={{
            animation: 'scan 2s linear infinite',
            transform: 'translateY(-100%)'
          }}
        />
      </div>
    </div>
  );
}