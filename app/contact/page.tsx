import React from 'react';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#16213e] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-orbitron font-bold text-4xl mb-8 text-center text-[#7303c0]">
            CONTACT US
          </h1>
          
          <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-8 clip-polygon">
            <div className="space-y-6">
              <div>
                <h2 className="font-orbitron font-bold text-xl mb-4 text-[#7303c0]">CONTACT US</h2>
                <p className="text-[#928dab] mb-6">
                  If you have any questions, feel free to reach out:
                </p>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-orbitron font-bold text-lg mb-4 text-[#7303c0]">GENERAL CONTACT</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">EMAIL</div>
                      <div className="text-[#928dab]">gen201hackathon@mbcpeermade.com</div>
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">PHONE</div>
                      <div className="text-[#928dab]">+91-8848258798</div>
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">ADDRESS</div>
                      <div className="text-[#928dab]">
                        Mar Baselios Christian College of Engineering and Technology, Kuttikkanam,<br />
                        Pallikunnu Peermade Rd, Peermade, Kuttikkanam,<br />
                        Kerala 685531
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-orbitron font-bold text-lg mb-4 text-[#7303c0]">FACULTY COORDINATORS</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">Sobin Mathew</div>
                      <div className="text-[#928dab]">+91-9946588784</div>
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">Ajeena Ashref</div>
                      <div className="text-[#928dab]">+91-8078470896</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-orbitron font-bold text-lg mb-4 text-[#7303c0]">STUDENT COORDINATORS</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">Noel Biju</div>
                      <div className="text-[#928dab]">+91-8848258798</div>
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">Selma Anna Saju</div>
                      <div className="text-[#928dab]">+91-8848244807</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
