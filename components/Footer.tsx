export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-orbitron font-black text-2xl mb-4">
              GEN <span className="text-gray-400">201</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Creating the next generation of technological innovators. 
              Join us for 48 hours of intense coding, collaboration, and innovation.
            </p>
          </div>
          
          <div>
            <h3 className="font-orbitron font-bold text-lg mb-4">QUICK LINKS</h3>
            <div className="space-y-2">
              {['About', 'Timeline', 'Prizes', 'FAQ', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-orbitron font-bold text-lg mb-4">CONNECT</h3>
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">info@gen201.com</div>
              <div className="text-gray-400 text-sm">+91 12345 67890</div>
              <div className="text-gray-400 text-sm">CSE (AI) Department</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 GEN 201. All rights reserved. Organized by CSE (AI) Department.
            </div>
            <div className="text-gray-400 text-sm">
              Powered by innovation. Built for the future.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}