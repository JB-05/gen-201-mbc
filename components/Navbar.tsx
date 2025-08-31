'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Prizes', href: '#prizes' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Sponsors', href: '#sponsors' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled || isMenuOpen ? 'bg-black/90 backdrop-blur-sm border-b border-[#7303c0]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="font-orbitron font-black text-xl tracking-wider">
            GEN <span className="text-[#928dab]">201</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[#928dab] hover:text-[#7303c0] font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7303c0] transition-all duration-200 group-hover:w-full clip-polygon"></span>
              </Link>
            ))}
            <Link
              href="/register"
              className="bg-[#7303c0] text-white px-6 py-2 clip-polygon font-medium hover:bg-[#928dab] transition-colors duration-200"
            >
              REGISTER
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 focus:outline-none group"
          >
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <span className={`block h-0.5 bg-[#7303c0] transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`block h-0.5 bg-[#7303c0] transition-all duration-300 ${isMenuOpen ? 'w-0 opacity-0' : 'w-4'}`}></span>
              <span className={`block h-0.5 bg-[#7303c0] transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-[#928dab] hover:text-[#7303c0] font-medium transition-colors duration-200 py-2"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-[#7303c0] text-white px-6 py-2 clip-polygon font-medium hover:bg-[#928dab] transition-colors duration-200 text-center mt-4"
            >
              REGISTER
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}