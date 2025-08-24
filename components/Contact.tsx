export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gradient-futuristic">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-6 tracking-wider">
            GET IN <span className="text-gray-400">TOUCH</span>
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8 clip-polygon"></div>
          <p className="text-gray-300 text-lg">
            Have questions? Ready to join the revolution? Let's connect.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-8">
              <div className="bg-black border border-gray-700 p-6 clip-polygon">
                <h3 className="font-orbitron font-bold text-xl mb-4">EVENT DETAILS</h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-orbitron font-bold text-sm text-gray-400 mb-1">LOCATION</div>
                    <div className="text-gray-300">CSE (AI) Department<br />Main Campus, University</div>
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-gray-400 mb-1">DATE & TIME</div>
                    <div className="text-gray-300">October 10-11, 2025<br />48 Hours Non-stop</div>
                  </div>
                </div>
              </div>

              <div className="bg-black border border-gray-700 p-6 clip-polygon">
                <h3 className="font-orbitron font-bold text-xl mb-4">CONTACT INFO</h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-orbitron font-bold text-sm text-gray-400 mb-1">EMAIL</div>
                    <div className="text-gray-300">info@gen201.com<br />support@gen201.com</div>
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-gray-400 mb-1">PHONE</div>
                    <div className="text-gray-300">+91 12345 67890<br />+91 98765 43210</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-black border border-gray-700 p-8 clip-polygon h-full">
              <h3 className="font-orbitron font-bold text-xl mb-6">QUICK MESSAGE</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="YOUR NAME"
                      className="w-full bg-gray-900 border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="YOUR EMAIL"
                      className="w-full bg-gray-900 border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white placeholder-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="SUBJECT"
                    className="w-full bg-gray-900 border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <textarea
                    rows={5}
                    placeholder="YOUR MESSAGE"
                    className="w-full bg-gray-900 border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white placeholder-gray-500 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black py-3 clip-polygon font-orbitron font-bold hover:bg-gray-200 transition-colors duration-200"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Embed */}
        <div className="mt-12">
          <div className="bg-black border border-gray-700 p-4 clip-polygon">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="font-orbitron font-bold text-xl mb-2">LOCATION MAP</div>
                <div className="text-gray-400">Interactive map will be embedded here</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}