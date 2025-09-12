import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#16213e] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-orbitron font-bold text-4xl mb-8 text-center text-[#7303c0]">
            PRIVACY POLICY
          </h1>
          
          <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-8 clip-polygon">
            <div className="space-y-6">
              <div>
                <h2 className="font-orbitron font-bold text-xl mb-4 text-[#7303c0]">PRIVACY POLICY</h2>
                <p className="text-[#928dab] mb-6">
                  We respect your privacy and are committed to handling your personal information responsibly.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[#928dab] mb-4">
                    Collected data (such as name, email, phone number, and school details) will be used for event communication, coordination, and other related purposes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-orbitron font-bold text-lg mb-3 text-[#7303c0]">WE MAY ALSO USE THE INFORMATION TO:</h3>
                  <ul className="text-[#928dab] space-y-2 ml-4">
                    <li>• Share details about future events, workshops, and initiatives organized by us or our partners.</li>
                    <li>• Improve our services and gather feedback for research and development.</li>
                  </ul>
                </div>
                
                <div>
                  <p className="text-[#928dab] mb-4">
                    Your details will not be sold to third parties. However, they may be shared with trusted partners or sponsors for educational and event-related purposes.
                  </p>
                </div>
                
                <div>
                  <p className="text-[#928dab] mb-4">
                    By registering, you consent to the collection and usage of your information as outlined above.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#7303c0]">
                <p className="text-[#928dab] text-sm">
                  For privacy-related questions or concerns, please contact us at gen201hackathon@mbcpeermade.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
