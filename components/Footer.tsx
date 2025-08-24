export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#7303c0]/30 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-orbitron font-black text-2xl mb-4">
              GEN <span className="text-[#928dab]">201</span>
            </div>
            <p className="text-[#928dab] text-sm leading-relaxed">
              Creating the next generation of technological innovators. 
              Join us for 48 hours of intense coding, collaboration, and innovation.
            </p>
          </div>
          
          <div>
            <h3 className="font-orbitron font-bold text-lg mb-4 text-[#7303c0]">QUICK LINKS</h3>
            <div className="space-y-2">
              {['About', 'Timeline', 'Prizes', 'FAQ', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-[#928dab] hover:text-[#7303c0] text-sm transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-orbitron font-bold text-lg mb-4 text-[#7303c0]">CONNECT</h3>
            <div className="space-y-2">
              <div className="text-[#928dab] text-sm">info@gen201.com</div>
              <div className="text-[#928dab] text-sm">+91 12345 67890</div>
              <div className="text-[#928dab] text-sm">CSE (AI) Department</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#7303c0]/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#928dab] text-sm mb-4 md:mb-0">
              © 2025 GEN 201. All rights reserved. Organized by CSE (AI) Department.
            </div>
            <div className="flex items-center gap-2 text-[#928dab] text-sm">
              <span>Designed and developed by</span>
              <a 
                href="https://ugenix.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block h-8 transition-transform hover:scale-105 hover:opacity-80"
              >
                <img 
                  src="assets/ugenix.svg"
                  alt="UgeniX" 
                  className="h-full w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}