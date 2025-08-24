export default function Sponsors() {
  const sponsors = [
    { name: 'Tech Corp', logo: 'https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop' },
    { name: 'Innovation Labs', logo: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop' },
    { name: 'AI Solutions', logo: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop' },
    { name: 'Digital Dynamics', logo: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop' },
    { name: 'Future Systems', logo: 'https://images.pexels.com/photos/356043/pexels-photo-356043.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop' },
    { name: 'Code Masters', logo: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop' },
  ];

  return (
    <section id="sponsors" className="py-20 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-6 tracking-wider">
            POWERED BY <span className="text-gray-400">SPONSORS</span>
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8 clip-polygon"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Industry leaders and innovators supporting the next generation of technological breakthroughs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-futuristic border border-gray-700 p-6 clip-polygon hover:border-white transition-all duration-300 relative overflow-hidden">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-full h-20 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-futuristic border border-gray-700 p-8 clip-polygon">
            <h3 className="font-orbitron font-bold text-2xl mb-4">BECOME A SPONSOR</h3>
            <p className="text-gray-300 mb-6">
              Join us in shaping the future. Partner with GEN 201 and connect with brilliant minds.
            </p>
            <a
              href="mailto:sponsors@gen201.com"
              className="inline-block bg-white text-black px-6 py-3 clip-polygon font-orbitron font-bold hover:bg-gray-200 transition-colors duration-200"
            >
              CONTACT US
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}