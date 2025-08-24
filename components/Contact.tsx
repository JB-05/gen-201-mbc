export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-black/95">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-6 tracking-wider">
            GET IN <span className="text-[#928dab]">TOUCH</span>
          </h2>
          <div className="w-24 h-1 bg-[#7303c0] mx-auto mb-8 clip-polygon"></div>
          <p className="text-[#928dab] text-lg">
            Have questions? Ready to join the revolution? Let's connect.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-8">
              <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-6 clip-polygon">
                <h3 className="font-orbitron font-bold text-xl mb-4 text-[#7303c0]">EVENT DETAILS</h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">LOCATION</div>
                    <div className="text-[#928dab]">CSE (AI) Department<br />Main Campus, University</div>
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">DATE & TIME</div>
                    <div className="text-[#928dab]">October 10-11, 2025<br />48 Hours Non-stop</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-6 clip-polygon">
                <h3 className="font-orbitron font-bold text-xl mb-4 text-[#7303c0]">CONTACT INFO</h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">EMAIL</div>
                    <div className="text-[#928dab]">info@gen201.com<br />support@gen201.com</div>
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-[#7303c0] mb-1">PHONE</div>
                    <div className="text-[#928dab]">+91 12345 67890<br />+91 98765 43210</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-8 clip-polygon h-full">
              <h3 className="font-orbitron font-bold text-xl mb-6 text-[#7303c0]">QUICK MESSAGE</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="YOUR NAME"
                      className="w-full bg-black/50 border border-[#7303c0] p-3 clip-polygon focus:border-[#928dab] focus:outline-none text-white placeholder-[#928dab]/50"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="YOUR EMAIL"
                      className="w-full bg-black/50 border border-[#7303c0] p-3 clip-polygon focus:border-[#928dab] focus:outline-none text-white placeholder-[#928dab]/50"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="SUBJECT"
                    className="w-full bg-black/50 border border-[#7303c0] p-3 clip-polygon focus:border-[#928dab] focus:outline-none text-white placeholder-[#928dab]/50"
                  />
                </div>
                <div>
                  <textarea
                    rows={5}
                    placeholder="YOUR MESSAGE"
                    className="w-full bg-black/50 border border-[#7303c0] p-3 clip-polygon focus:border-[#928dab] focus:outline-none text-white placeholder-[#928dab]/50 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#7303c0] text-white py-3 clip-polygon font-orbitron font-bold hover:bg-[#928dab] transition-colors duration-200"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Embed */}
        <div className="mt-12">
          <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-4 clip-polygon">
            <div className="aspect-video w-full overflow-hidden">
              <iframe 
                width="100%" 
                height="100%"
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Mar%20baseilos%20christian%20college%20of%20engineering%20and%20technology,%20Peermade,%20Kuttikkanam,%20Kerala%20685531+(Mar%20Baselios%20Christian%20College)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                className="w-full h-full"
                title="MBCCET Location Map"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}