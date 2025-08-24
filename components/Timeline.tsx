'use client';

import { useEffect, useState } from 'react';

export default function Timeline() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // For demo purposes, we'll use a simulated timeline starting from now
  const getEventStatus = (eventDate: string, index: number) => {
    // Demo: Set first event as completed, second as active, rest as upcoming
    if (index === 0) return 'completed';
    if (index === 1) return 'active';
    return 'upcoming';
  };

  // Calculate progress percentage for the vertical line
  const calculateProgress = () => {
    const firstDate = new Date('2025 SEPT 1');
    const lastDate = new Date('2025 OCT 11');
    const now = currentDate;
    const total = lastDate.getTime() - firstDate.getTime();
    const current = now.getTime() - firstDate.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  };

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
    <section id="timeline" className="py-20 bg-black/95">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-black text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 tracking-wider">
            EVENT <span className="text-[#928dab]">TIMELINE</span>
          </h2>
          <div className="w-16 md:w-24 h-1 bg-[#7303c0] mx-auto mb-6 md:mb-8 clip-polygon"></div>
          <p className="text-[#928dab] text-base md:text-lg max-w-2xl mx-auto px-4 md:px-0">
            A carefully orchestrated sequence of events leading to the ultimate coding showdown.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line container - Hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-[#928dab]/20 h-full overflow-hidden">
            {/* Animated background */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#7303c0] via-[#DAA520] to-[#7303c0] bg-[length:100%_300%] animate-[flowingLine_3s_linear_infinite]"
            />
            {/* Progress overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" 
              style={{ 
                height: `${100 - calculateProgress()}%`,
                top: `${calculateProgress()}%`,
                transition: 'all 1000ms ease-in-out'
              }} 
            />
            {/* Glowing effect */}
            <div 
              className="absolute w-[3px] blur-sm left-[-1px] bg-gradient-to-b from-[#7303c0] via-[#DAA520] to-[#7303c0] bg-[length:100%_300%] animate-[flowingLine_3s_linear_infinite]"
              style={{ 
                height: `${calculateProgress()}%`,
                transition: 'height 1000ms ease-in-out'
              }}
            />
          </div>
          
          <div className="space-y-12 md:space-y-0">
            {timelineEvents.map((event, index) => {
              const status = getEventStatus(event.date, index);
              const isLeft = index % 2 === 0;
              
              return (
                <div 
                  key={index} 
                  className={`
                    flex flex-col md:flex-row items-start md:items-center 
                    ${isLeft ? '' : 'md:flex-row-reverse'} mb-12 md:mb-0
                    ${status === 'upcoming' ? 'opacity-50' : 'opacity-100'}
                    transition-all duration-1000 relative
                  `}
                >
                  {/* Mobile timeline line */}
                  <div className="absolute left-[21px] top-[40px] w-1 h-[calc(100%-20px)] bg-[#928dab]/20 md:hidden overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#7303c0] via-[#DAA520] to-[#7303c0] bg-[length:100%_300%] animate-[flowingLine_3s_linear_infinite]" />
                  </div>

                  {/* Mobile node */}
                  <div className="absolute left-4 top-6 z-10 md:hidden">
                    <div className={`
                      w-6 h-6 border-4 border-black clip-polygon transition-all duration-500
                      ${status === 'completed' ? 'bg-[#7303c0] scale-125' : 
                        status === 'active' ? 'bg-[#DAA520] scale-150 animate-pulse' : 
                        'bg-[#928dab]'}
                    `} />
                  </div>

                  <div className={`w-full pl-16 md:pl-0 md:w-1/2 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                    <div 
                      className={`
                        bg-black/30 border-2 p-6 clip-polygon relative group backdrop-blur-sm
                        ${status === 'completed' ? 'border-[#7303c0] shadow-[0_0_10px_rgba(115,3,192,0.2)]' : 
                          status === 'active' ? 'border-[#DAA520] shadow-[0_0_15px_rgba(218,165,32,0.3)]' : 
                          'border-[#928dab]'}
                        transition-all duration-500 hover:scale-105
                      `}
                    >
                      {index === 0 && (
                        <div className='absolute top-0 left-8'>
                        <div className="absolute flex items-center gap-1.5 z-0">
                          <div className="w-2 h-2 rounded-full animate-[livePulse_2s_infinite]" />
                          <span className="text-red-500 font-orbitron text-sm font-bold animate-[textGlow_2s_infinite]">
                            LIVE
                          </span>
                        </div>
                        </div>
                      )}
                      <div className={`
                        font-orbitron font-bold text-sm mb-2
                        ${status === 'completed' ? 'text-[#7303c0]' : 
                          status === 'active' ? 'text-[#DAA520]' : 
                          'text-[#928dab]'}
                      `}>
                        {event.date}
                      </div>
                      <h3 className="font-orbitron font-bold text-xl mb-3 text-[#928dab]">{event.title}</h3>
                      <p className="text-[#928dab] text-sm leading-relaxed">{event.description}</p>
                      
                      {/* Status indicator */}
                      <div className={`absolute top-4 ${isLeft ? 'left-4' : 'right-4'}`}>
                        <div className={`
                          w-2 h-2 clip-polygon
                          ${status === 'completed' ? 'bg-gradient-to-r from-[#7303c0] to-[#7303c0] animate-pulse' : 
                            status === 'active' ? 'bg-gradient-to-r from-[#DAA520] to-[#DAA520] animate-ping' : 
                            'bg-[#928dab]'}
                          bg-[length:200%_100%] animate-[flowingLine_3s_linear_infinite]
                        `}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Central node - Hidden on mobile */}
                  <div className="hidden md:block relative z-10">
                    <div className={`
                      w-6 h-6 border-4 border-black clip-polygon transition-all duration-500
                      ${status === 'completed' ? 'bg-[#7303c0] scale-125' : 
                        status === 'active' ? 'bg-[#DAA520] scale-150 animate-[progressPulse_2s_infinite]' : 
                        'bg-[#928dab] hover:scale-110'}
                    `}></div>
                  </div>
                  
                  <div className="hidden md:block w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}