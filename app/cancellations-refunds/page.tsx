import React from 'react';

export default function CancellationsRefundsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#16213e] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-orbitron font-bold text-4xl mb-8 text-center text-[#7303c0]">
            CANCELLATIONS AND REFUNDS
          </h1>
          
          <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-8 clip-polygon">
            <div className="space-y-6">
              <div>
                <h2 className="font-orbitron font-bold text-xl mb-4 text-[#7303c0]">CANCELLATIONS AND REFUNDS</h2>
                <p className="text-[#928dab] mb-6">
                  Please review our cancellation and refund policy before making any payments.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[#928dab] mb-4">
                    The registration fee is non-refundable in case of withdrawal or idea rejection.
                  </p>
                </div>
                
                <div>
                  <p className="text-[#928dab] mb-4">
                    In the rare case of event cancellation due to political, environmental, or unforeseen reasons, the organizers will review and decide on refunds.
                  </p>
                </div>
                
                <div>
                  <p className="text-[#928dab] mb-4">
                    The decision of the Gen 201 Hackathon Committee regarding refunds will be final.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#7303c0]">
                <p className="text-[#928dab] text-sm">
                  For refund inquiries, please contact us at gen201hackathon@mbcpeermade.com with your registration details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
