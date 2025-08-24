export default function Timeline() {
  const timelineEvents = [
    {
      date: 'SEPT 1',
      title: 'REGISTRATION OPENS',
      description: 'Begin your journey. Registration portal goes live.',
      status: 'upcoming'
    },
    {
      date: 'SEPT 20',
      title: 'REGISTRATION CLOSES',
      description: 'Final call for participants. Prepare for evaluation.',
      status: 'upcoming'
    },
    {
      date: 'SEPT 25',
      title: 'SHORTLISTING',
      description: 'Selected teams receive confirmation and briefing.',
      status: 'upcoming'
    },
    {
      date: 'OCT 10',
      title: 'HACKATHON BEGINS',
      description: '48 hours of intense coding and innovation start.',
      status: 'upcoming'
    },
    {
      date: 'OCT 11',
      title: 'SUBMISSION & WINNERS',
      description: 'Final presentations and winner announcements.',
      status: 'upcoming'
    },
  ];

  return (
    <section id="timeline" className="py-20 bg-gradient-futuristic">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-6 tracking-wider">
            EVENT <span className="text-gray-400">TIMELINE</span>
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8 clip-polygon"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            A carefully orchestrated sequence of events leading to the ultimate coding showdown.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-white via-gray-400 to-white h-full"></div>
          
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-black border border-gray-700 p-6 clip-polygon relative group hover:border-white transition-all duration-300">
                    <div className="font-orbitron font-bold text-sm text-gray-400 mb-2">{event.date}</div>
                    <h3 className="font-orbitron font-bold text-xl mb-3">{event.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
                    
                    {/* Status indicator */}
                    <div className={`absolute top-4 ${index % 2 === 0 ? 'left-4' : 'right-4'}`}>
                      <div className="w-2 h-2 bg-white clip-polygon"></div>
                    </div>
                  </div>
                </div>
                
                {/* Central node */}
                <div className="relative z-10">
                  <div className="w-6 h-6 bg-white border-4 border-black clip-polygon"></div>
                </div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}