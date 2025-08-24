export default function Prizes() {
  const prizes = [
    {
      rank: '1ST',
      amount: '₹25,000',
      perks: ['Cash Prize', 'Winner Certificate', 'Internship Opportunity', 'Tech Goodies'],
      highlight: true
    },
    {
      rank: '2ND',
      amount: '₹15,000',
      perks: ['Cash Prize', 'Certificate', 'Mentorship Session', 'Tech Goodies'],
      highlight: false
    },
    {
      rank: '3RD',
      amount: '₹10,000',
      perks: ['Cash Prize', 'Certificate', 'Course Vouchers', 'Tech Goodies'],
      highlight: false
    }
  ];

  return (
    <section id="prizes" className="py-20 bg-black">
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

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {prizes.map((prize, index) => (
            <div key={index} className={`relative group ${prize.highlight ? 'transform scale-105' : ''}`}>
              <div className={`bg-black/30 backdrop-blur-sm border-2 ${prize.highlight ? 'border-[#7303c0]' : 'border-[#928dab]'} p-8 clip-polygon relative transition-all duration-300 hover:border-[#7303c0] group-hover:bg-[#7303c0]/10`}>
                {prize.highlight && (
                  <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 bg-[#7303c0] text-white px-4 py-1 clip-polygon text-sm font-orbitron font-bold">
                    CHAMPION
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="font-orbitron font-black text-3xl mb-2 text-[#7303c0]">{prize.rank}</div>
                  <div className="font-orbitron font-bold text-2xl text-[#928dab]">{prize.amount}</div>
                </div>
                
                <div className="space-y-3">
                  {prize.perks.map((perk, perkIndex) => (
                    <div key={perkIndex} className="flex items-center text-[#928dab]">
                      <div className="w-2 h-2 bg-[#7303c0] mr-3 clip-polygon"></div>
                      <span className="text-sm">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Rewards */}
        <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-8 clip-polygon">
          <div className="text-center mb-6">
            <h3 className="font-orbitron font-bold text-2xl mb-4 text-[#7303c0]">ADDITIONAL REWARDS</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/30 border border-[#7303c0] p-6 clip-polygon backdrop-blur-sm">
              <h4 className="font-orbitron font-bold text-lg mb-3 text-[#928dab]">TOP 10 TEAMS</h4>
              <p className="text-[#928dab] text-sm mb-4">All top 10 teams receive exclusive tech goodies and certificates of participation.</p>
              <div className="flex items-center text-[#928dab]">
                <div className="w-2 h-2 bg-[#7303c0] mr-3 clip-polygon"></div>
                <span className="text-sm">Merchandise package</span>
              </div>
            </div>
            
            <div className="bg-black/30 border border-[#7303c0] p-6 clip-polygon backdrop-blur-sm">
              <h4 className="font-orbitron font-bold text-lg mb-3 text-[#928dab]">SPECIAL CATEGORIES</h4>
              <p className="text-[#928dab] text-sm mb-4">Additional recognition for innovation in AI, sustainability, and social impact.</p>
              <div className="flex items-center text-[#928dab]">
                <div className="w-2 h-2 bg-[#7303c0] mr-3 clip-polygon"></div>
                <span className="text-sm">Category-specific awards and mentions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}