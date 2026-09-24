import { motion, useTransform, useScroll } from 'framer-motion';
import { useRef } from 'react';

const InstitutionSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

  const cards = [
    {
      title: "About SLRTCE",
      description: "Shree L. R. Tiwari College of Engineering (SLRTCE), established in 2010, is an autonomous engineering institute affiliated with the University of Mumbai. Approved by AICTE, recognized by the Government of Maharashtra, and NAAC-accredited, it stands as a premier institute for technical education.",
      icon: "🏛️",
      color: "bg-[#1B4A4A]"
    },
    {
      title: "About Department",
      description: "Dedicated to academic excellence, research, and innovation, the department fosters a culture of technical proficiency and holistic development. It empowers future engineers with the knowledge and practical skills needed to solve real-world challenges.",
      icon: "💻",
      color: "bg-[#0A2A5E]" // brand-navy
    },
    {
      title: "About IEEE Chapter",
      description: "The IEEE SLRTCE Student Branch is a vibrant community of tech enthusiasts. By organizing impactful colloquiums, technical seminars, and innovation drives, it serves as a crucial bridge between academic learning and industry standards.",
      icon: "⚡",
      color: "bg-[#FF6B00]" // brand-orange
    }
  ];

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-gray-50 z-20">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex w-[300vw]">
          {cards.map((card, i) => (
            <div key={i} className="w-[100vw] h-screen flex items-center justify-center p-6 md:p-12 lg:p-24">

              {i === 2 ? (
                // -------------------------------------------------------------
                // GIANT IEEE STAMP CARD
                // -------------------------------------------------------------
                <div className="w-full max-w-[90vw] lg:max-w-7xl h-[80vh] md:h-[90vh] stamp-card shadow-[0_30px_60px_rgba(0,0,0,0.4)] bg-[#F5F0E6] p-4 sm:p-6 md:p-8">
                  <div className="relative w-full h-full overflow-hidden border border-black/10 rounded-sm bg-[#1A202C] flex items-center justify-center p-6 md:p-16">
                    {/* Background */}
                    <div
                      className="absolute inset-0 opacity-40 bg-cover bg-center brightness-105"
                      style={{ backgroundImage: `url('/backgrounds/bg-maroon-n.jpg')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none z-10" />

                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center">
                      <div className="bg-[#0A2540]/80 md:backdrop-blur-md p-8 md:p-16 rounded-2xl border border-white/20 shadow-2xl max-w-5xl">
                        <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-6 md:drop-shadow-lg tracking-wider uppercase">
                          IEEE SLRTCE Student Branch
                        </h2>
                        <div className="w-24 h-1 md:h-2 bg-amber-400 mx-auto mb-8 rounded-full" />
                        <p className="text-lg md:text-2xl lg:text-3xl text-white/95 leading-relaxed font-light md:drop-shadow-md">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // -------------------------------------------------------------
                // DEFAULT CARDS (About SLRTCE & About Dept)
                // -------------------------------------------------------------
                <div className={`w-full max-w-6xl h-[70vh] md:h-[80vh] ${card.color} rounded-[2rem] shadow-2xl p-10 md:p-16 flex flex-col items-center justify-center text-center text-white relative overflow-hidden`}>

                  {/* Decorative background element */}
                  <div className="absolute top-[-5%] right-[-5%] text-[15rem] md:text-[25rem] opacity-10 pointer-events-none rotate-12">
                    {card.icon}
                  </div>

                  <div className="w-full flex flex-col items-center justify-center z-10 max-w-4xl mx-auto">
                    {i === 1 ? (
                      <img 
                        src="/department-logo.webp" 
                        alt="Department of Computer Engineering" 
                        className="max-w-full h-auto max-h-[30vh] md:max-h-[40vh] object-contain md:drop-shadow-2xl hover:scale-105 transition-transform duration-500 mb-8 md:mb-12" 
                      />
                    ) : (
                      <>
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-2xl flex items-center justify-center text-3xl md:text-5xl mb-8 md:backdrop-blur-md border border-white/20 shadow-lg mx-auto">
                          {card.icon}
                        </div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-10 font-display tracking-tight">{card.title}</h2>
                      </>
                    )}
                    
                    <p className="text-lg md:text-2xl lg:text-3xl text-white/90 leading-relaxed md:leading-snug font-light">
                      {card.description}
                    </p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InstitutionSection;
