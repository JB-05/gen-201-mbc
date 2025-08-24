export default function About() {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-6 tracking-wider">
            ABOUT <span className="text-gray-400">GEN 201</span>
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8 clip-polygon"></div>
        </div>
        
        <div className="bg-gradient-futuristic border border-gray-700 p-8 md:p-12 clip-polygon relative">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-orbitron font-bold text-2xl mb-4">THE CHALLENGE</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                GEN 201 is not just another hackathon—it's a battleground where the brightest minds converge to architect the future. Over 48 intense hours, participants will push the boundaries of innovation, creating solutions that will define tomorrow's technological landscape.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This is your chance to collaborate with like-minded visionaries, learn from industry experts, and transform abstract ideas into tangible reality.
              </p>
            </div>
            
            <div>
              <h3 className="font-orbitron font-bold text-2xl mb-4">ORGANIZED BY</h3>
              <div className="bg-black/50 border border-gray-700 p-6 clip-polygon mb-6">
                <h4 className="font-orbitron font-bold text-lg mb-2">CSE (AI) DEPARTMENT</h4>
                <p className="text-gray-400 text-sm">
                  Leading the charge in artificial intelligence education and innovation, fostering the next generation of tech pioneers.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-white mr-3 clip-polygon"></div>
                  <span>48-hour intensive coding marathon</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-white mr-3 clip-polygon"></div>
                  <span>Multi-disciplinary team collaboration</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-white mr-3 clip-polygon"></div>
                  <span>Industry mentor guidance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}