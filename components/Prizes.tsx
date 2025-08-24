export default function Prizes() {
  const prizes = [
    {
      rank: '1ST',
      amount: '₹25,000',
      perks: ['Cash Prize', 'Winner Certificate',],
      highlight: true
    },
    {
      rank: '2ND',
      amount: '₹15,000',
      perks: ['Cash Prize', 'Certificate',],
      highlight: false
    },
    {
      rank: '3RD',
      amount: '₹10,000',
      perks: ['Cash Prize', 'Certificate'],
      highlight: false
    }
  ];

  return (
    <section id="prizes" className="py-20 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-6 tracking-wider">
            PRIZE <span className="text-[#928dab]">POOL</span>
          </h2>
          <div className="w-24 h-1 bg-[#7303c0] mx-auto mb-8 clip-polygon"></div>
          <p className="text-[#928dab] text-lg max-w-2xl mx-auto">
            ₹50,000+ in total prizes awaiting the most innovative teams. Excellence will be rewarded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative">
          {/* Second Prize */}
          <div className="relative group md:mt-12">
            <div className="bg-black/30 backdrop-blur-sm border-2 border-[#C0C0C0] p-8 clip-polygon relative transition-all duration-300 hover:border-[#E8E8E8] group-hover:bg-[#C0C0C0]/5 shadow-[0_0_15px_rgba(192,192,192,0.3)]">
              <div className="text-center mb-6">
                <div className="font-orbitron font-black text-3xl mb-2 bg-gradient-to-r from-[#C0C0C0] via-[#E8E8E8] to-[#C0C0C0] text-transparent bg-clip-text">{prizes[1].rank}</div>
                <div className="font-orbitron font-bold text-2xl text-[#E8E8E8]">{prizes[1].amount}</div>
              </div>
              <div className="space-y-3">
                {prizes[1].perks.map((perk, perkIndex) => (
                  <div key={perkIndex} className="flex items-center text-[#E8E8E8]">
                    <div className="w-2 h-2 bg-[#C0C0C0] mr-3 clip-polygon"></div>
                    <span className="text-sm">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* First Prize */}
          <div className="relative group transform scale-110 z-10">
            <div className="bg-black/30 backdrop-blur-sm border-2 border-[#B8860B] p-8 clip-polygon relative transition-all duration-300 hover:border-[#DAA520] group-hover:bg-[#B8860B]/5 shadow-[0_0_15px_rgba(184,134,11,0.3)]">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] text-black px-6 py-2 clip-polygon text-sm font-orbitron font-bold">
                CHAMPION
              </div>
              <div className="text-center mb-6 relative">
                <div className="font-orbitron font-black text-4xl mb-3 bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] text-transparent bg-clip-text">{prizes[0].rank}</div>
                <div className="font-orbitron font-bold text-3xl text-[#DAA520]">{prizes[0].amount}</div>
              </div>
              <div className="space-y-3">
                {prizes[0].perks.map((perk, perkIndex) => (
                  <div key={perkIndex} className="flex items-center text-[#DAA520]">
                    <div className="w-2 h-2 bg-[#B8860B] mr-3 clip-polygon"></div>
                    <span className="text-sm">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Third Prize */}
          <div className="relative group md:mt-12">
            <div className="bg-black/30 backdrop-blur-sm border-2 border-[#CD7F32] p-8 clip-polygon relative transition-all duration-300 hover:border-[#DFA878] group-hover:bg-[#CD7F32]/5 shadow-[0_0_15px_rgba(205,127,50,0.3)]">
              <div className="text-center mb-6">
                <div className="font-orbitron font-black text-3xl mb-2 bg-gradient-to-r from-[#CD7F32] via-[#DFA878] to-[#CD7F32] text-transparent bg-clip-text">{prizes[2].rank}</div>
                <div className="font-orbitron font-bold text-2xl text-[#DFA878]">{prizes[2].amount}</div>
              </div>
              <div className="space-y-3">
                {prizes[2].perks.map((perk, perkIndex) => (
                  <div key={perkIndex} className="flex items-center text-[#DFA878]">
                    <div className="w-2 h-2 bg-[#CD7F32] mr-3 clip-polygon"></div>
                    <span className="text-sm">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Rewards */}
        <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-8 clip-polygon">
          <div className="text-center mb-6">
            <h3 className="font-orbitron font-bold text-2xl mb-4 text-[#7303c0]">ADDITIONAL REWARDS</h3>
          </div>
          
          <div className=" flex justify-center items-center">
            <div className="bg-black/30 border border-[#7303c0] p-6 clip-polygon backdrop-blur-sm">
              <h4 className="font-orbitron font-bold text-lg mb-3 text-[#928dab]">TOP 10 TEAMS</h4>
              <p className="text-[#928dab] text-sm mb-4">All top 10 teams receive exclusive tech goodies and certificates of participation.</p>
              <div className="flex items-center text-[#928dab]">
                <div className="w-2 h-2 bg-[#7303c0] mr-3 clip-polygon"></div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}