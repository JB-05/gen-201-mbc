import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Users, Trophy } from 'lucide-react';

export default function EventClosedPage() {
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <Image
              src="/assets/gen201_logo.png"
              alt="GEN 201 Logo"
              width={400}
              height={120}
              className="h-20 sm:h-24 md:h-28 w-auto"
              priority
            />
          </div>
          
          <div className="relative inline-block mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-red-500 text-lg font-orbitron font-bold tracking-wider">EVENT COMPLETED</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-[#928dab] mb-8 backdrop-blur-sm py-12 px-8 rounded-lg border border-[#7303c0]/20">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
                Thank You for Participating!
              </h1>
              <p className="text-lg mb-6">
                GEN 201 has been completed successfully. We appreciate all the participants who made this event memorable.
              </p>
            </div>

            {/* Event Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-black/30 border border-[#7303c0] p-6 clip-polygon">
                <Calendar className="w-8 h-8 text-[#7303c0] mx-auto mb-3" />
                <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-2">EVENT DATES</div>
                <div className="text-sm text-[#928dab]">OCT 10-11, 2025</div>
              </div>
              
              <div className="bg-black/30 border border-[#7303c0] p-6 clip-polygon">
                <Users className="w-8 h-8 text-[#7303c0] mx-auto mb-3" />
                <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-2">TEAMS</div>
                <div className="text-sm text-[#928dab]">85+ Teams</div>
              </div>
              
              <div className="bg-black/30 border border-[#7303c0] p-6 clip-polygon">
                <Users className="w-8 h-8 text-[#7303c0] mx-auto mb-3" />
                <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-2">PARTICIPANTS</div>
                <div className="text-sm text-[#928dab]">300+ Participants</div>
              </div>
              
              <div className="bg-black/30 border border-[#7303c0] p-6 clip-polygon">
                <Trophy className="w-8 h-8 text-[#7303c0] mx-auto mb-3" />
                <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-2">PRIZES</div>
                <div className="text-sm text-[#928dab]">₹50K+ Awarded</div>
              </div>
            </div>

            {/* Department Section */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Organized By</h2>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto">
                {/* Department Logo */}
                <div className="bg-black/30 border border-[#7303c0] p-6 clip-polygon">
                  <div className="text-center">
                    <Image
                      src="/assets/deptOfAI.png"
                      alt="Department of AI Logo"
                      width={200}
                      height={120}
                      className="mx-auto mb-3"
                    />
                    <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-2">DEPARTMENT OF AI</div>
                    <div className="text-xs text-[#928dab]">Organizing Committee</div>
                  </div>
                </div>
                
                {/* Department Team Photo */}
                <div className="bg-black/30 border border-[#7303c0] p-6 clip-polygon">
                  <div className="text-center">
                    <div className="w-80 h-56 rounded-lg overflow-hidden mb-3">
                      <Image
                        src="/assets/organizers.jpg"
                        alt="Department Team Photo"
                        width={320}
                        height={224}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-2">TEAM PHOTO</div>
                    <div className="text-xs text-[#928dab]">Department Members</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-sm text-[#928dab]">
                The event featured innovative projects from talented students across Kerala.
              </p>
              <p className="text-sm text-[#928dab]">
                Winners have been announced and prizes have been distributed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="inline-block bg-gray-600 text-white px-6 py-3 clip-arrow font-orbitron font-bold text-sm cursor-not-allowed opacity-60">
                REGISTRATION CLOSED
              </div>
              <Link
                href="/"
                className="inline-block bg-transparent text-[#7303c0] px-6 py-3 border border-[#7303c0] font-orbitron font-bold text-sm hover:bg-[#7303c0] hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                BACK TO HOME
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12">
        <div className="border-t border-[#7303c0]/20 pt-8">
          <div className="text-center text-[#928dab] text-sm">
            <p>&copy; 2025 GEN 201. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
