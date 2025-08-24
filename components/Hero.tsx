'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import heroBackground from '@/assets/hero-bg.jpg';

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2025-09-26T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden pt-16 md:pt-0">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-[-10%] scale-110">
          <Image
            src={heroBackground}
            alt="Hero Background"
            fill
            className="object-cover opacity-20 animate-[zoomInOut_20s_ease-in-out_infinite]"
            priority
            quality={100}
          />
        </div>
      </div>
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-25">
        <div 
          className="absolute inset-0 animate-[floatGrid_10s_ease-in-out_infinite]" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(146, 141, 171, 0.2) 1.5px, transparent 2px),
              linear-gradient(to bottom, rgba(115, 3, 192, 0.2) 2px, transparent 2px)
            `,
            backgroundSize: '50px 50px',
            backdropFilter: 'blur(3px)'
          }}
        ></div>
      </div>
      
      {/* Animated Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(45deg, transparent 0%, rgba(115, 3, 192, 0.15) 50%, transparent 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient 8s ease infinite'
        }}
      ></div>
      
      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <div className="mb-8">
          <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl mb-2 md:mb-4 tracking-wider">
            GEN <span className="text-[#928dab]">201</span>
          </h1>
          <div className="relative inline-block">
            <p className="font-rajdhani text-lg sm:text-xl md:text-2xl text-[#928dab] glitch">
              CREATING THE NEXT GENERATION
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xs sm:max-w-md mx-auto mb-6 md:mb-8">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="bg-black/30 border border-[#7303c0] p-2 sm:p-4 clip-polygon relative scan-line">
              <div className="font-orbitron font-bold text-lg sm:text-2xl md:text-3xl text-[#928dab]">{value.toString().padStart(2, '0')}</div>
              <div className="text-[10px] sm:text-xs text-[#7303c0] uppercase font-medium">{unit}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Link
            href="/register"
            className="inline-block bg-[#7303c0] text-white px-6 sm:px-8 py-3 sm:py-4 clip-arrow font-orbitron font-bold text-base sm:text-lg hover:bg-[#928dab] transition-all duration-300 transform hover:scale-105"
          >
            REGISTER NOW
          </Link>
          
          {/* Quick Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12 max-w-2xl mx-auto">
            <div className="bg-black/30 border border-[#7303c0] p-3 sm:p-4 clip-polygon">
              <div className="font-orbitron font-bold text-xs sm:text-sm text-[#7303c0]">DATE</div>
              <div className="font-medium text-sm sm:text-base text-[#928dab]">OCT 10-11, 2025</div>
            </div>
            <div className="bg-black/30 border border-[#7303c0] p-3 sm:p-4 clip-polygon">
              <div className="font-orbitron font-bold text-xs sm:text-sm text-[#7303c0]">VENUE</div>
              <div className="font-medium text-sm sm:text-base text-[#928dab]">CSE DEPARTMENT</div>
            </div>
            <div className="bg-black/30 border border-[#7303c0] p-3 sm:p-4 clip-polygon sm:col-span-2 md:col-span-1">
              <div className="font-orbitron font-bold text-xs sm:text-sm text-[#7303c0]">PRIZES</div>
              <div className="font-medium text-sm sm:text-base text-[#928dab]">₹50K+ TOTAL</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}