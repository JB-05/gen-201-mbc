import { RegistrationForm } from '@/components/registration/RegistrationForm';
import { Toaster } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
      {/* Back to Home Button */}
      <div className="absolute top-8 left-8 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm border border-[#7303c0] 
                     rounded-lg text-[#928dab] hover:text-white hover:bg-[#7303c0] transition-all duration-300
                     hover:scale-105 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-orbitron">Back to Home</span>
        </Link>
      </div>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(115, 3, 192, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(115, 3, 192, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Radial Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(115, 3, 192, 0.15) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.95) 100%)',
        }}
      />

      {/* Floating Accent Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#7303c0] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#928dab] rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Toaster />
      <div className="container mx-auto px-4 relative z-10">
        {/* Gradient Flowing Header */}
        <div className="text-center relative py-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-orbitron mb-8 gradient-text">
            Register for GEN 201
          </h1>
        </div>

        {/* Stylized Description */}
        <div className="relative">
          <p className="text-center text-[#928dab] mb-12 max-w-2xl mx-auto backdrop-blur-sm py-4 px-6 rounded-lg border border-[#7303c0]/20">
            Join us in this exciting hackathon! Fill out the form below to register your team.
            Make sure to provide accurate information for all team members.
          </p>
        </div>

        {/* Form Container with Backdrop Blur */}
        <div className="relative backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-[#7303c0]/20">
          <RegistrationForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-36 md:mt-48 lg:mt-64">
        {/* Separator Line with Gap */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#7303c0]/30 to-transparent my-8"></div>
        
        {/* Footer Content */}
        <div className="bg-[#0a0a0a]/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[#928dab] text-sm">
              © {new Date().getFullYear()} GEN 201. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-[#928dab] text-sm">
              <span>Designed and developed by</span>
              <a
                href="https://ugenix.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block h-8 transition-transform hover:scale-105 hover:opacity-80"
              >
                <img
                  src="/assets/ugenix.svg"
                  alt="UgeniX"
                  className="h-full w-auto"
                />
              </a>
            </div>
          </div>
        </div>
        </div>
      </footer>
    </main>
  );
}