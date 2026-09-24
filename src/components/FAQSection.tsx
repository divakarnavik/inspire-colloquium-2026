import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MessageSquare, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is INSPIRE 2026 and what is a Colloquium?',
    answer:
      'INSPIRE 2026 is a Research & Idea Colloquium that brings together undergraduate students, postgraduate students, and researchers to explore research, develop innovative ideas, and present technology-driven solutions to real-world challenges. \n\nIt provides a platform to showcase research work, innovative concepts, prototypes, experimental projects, and interdisciplinary ideas, while encouraging participants to connect knowledge with meaningful technological and societal impact aligned with the UNSDGs.',
    category: 'General',
  },
  {
    question: 'Who can participate?',
    answer:
      'The event is open to students across three distinct categories:\n• Category 1 (PPG): PhD Scholars / Researchers / Fellows\n• Category 2 (PG): ME / M.Tech students\n• Category 3 (UG & Diploma): Undergraduate and Diploma students',
    category: 'Participation',
  },
  {
    question: 'What is the allowable team size?',
    answer:
      '• PPG & PG Categories: Individual participation only (1 member per entry).\n• UG & Diploma Category: 2 to 4 members per team.',
    category: 'Participation',
  },
  {
    question: 'Is INSPIRE Colloquium open to inter-college and inter-department teams?',
    answer:
      'Yes. INSPIRE 2026 welcomes participation from students across different colleges and departments, encouraging interdisciplinary collaboration and the exchange of ideas.',
    category: 'Participation',
  },
  {
    question: 'Is the event held online or offline?',
    answer:
      'Round 1 abstract submission is conducted online, while shortlisted presentations for Rounds 2 and 3 take place on-campus on 3 October 2026.',
    category: 'Participation',
  },
  {
    question: 'What should be submitted in Round 1?',
    answer:
      'For Round 1, PhD participants must submit a structured abstract, while PG and UG/Diploma participants must submit a structured abstract along with a PPT, covering the problem statement, proposed solution, track, and UNSDG alignment for initial screening.',
    category: 'Registration & Competition',
  },
  {
    question: 'Is there any registration fee?',
    answer:
      'Initial submission is free, but shortlisted teams must pay a ₹300 per team registration fee to confirm participation.',
    category: 'Registration & Competition',
  },
  {
    question: 'What is the competition format and structure?',
    answer:
      'INSPIRE 2026 is a 3-stage research colloquium:\n• Round 1 (Abstract/PPT Submission): Screening to select the Top 25 PPG, Top 25 PG, and Top 50 UG/Diploma teams.\n• Round 2 (Internal Round): Shortlisted teams deliver a strict 12-minute presentation evaluated on technical depth, methodology, and innovation. The top 25% from each category qualify for the finale.\n• Round 3 (External Round): Finalists present to an invited panel of external industry experts and academicians to determine the final award winners.',
    category: 'Registration & Competition',
  },
  {
    question: 'Will all participants receive certificates?',
    answer:
      'Yes, all participants who take part in the event will receive an official Online Participation Certificate.',
    category: 'Registration & Competition',
  },
  {
    question: 'What is the dress code for INSPIRE 2026?',
    answer:
      'Participants are expected to follow a formal dress code throughout the event to maintain a professional and academic environment.',
    category: 'General',
  },
];

const filterOptions = ['All', 'General', 'Participation', 'Registration & Competition'] as const;
type FilterOption = (typeof filterOptions)[number];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = useMemo(() => {
    if (activeFilter === 'All') return faqs;
    return faqs.filter((faq) => faq.category === activeFilter);
  }, [activeFilter]);

  return (
    <section
      id="faq"
      className="py-16 md:py-24 relative overflow-hidden bg-cover bg-center bg-scroll md:bg-fixed border-t border-b border-indigo-950/30 text-white scroll-mt-[65px] w-full max-w-full min-h-[calc(100vh-65px)] flex flex-col justify-center"
      style={{
        backgroundImage: "url('/backgrounds/bg-purple-n.jpg')",
      }}
    >
      {/* Tactile Fine Grain Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: "url('/backgrounds/noise-texture.svg')",
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Subtle Vignette for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/40 z-0" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10 w-full">
        {/* Section Header */}
        {/* Top Left Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-14 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans mb-2">
              Got Questions?
            </h2>
            <div className="w-16 h-[3px] bg-amber-400 rounded-full mb-3" />
            <p className="text-sm sm:text-base text-white/80 font-sans">
              Find answers to the most commonly asked questions about INSPIRE 2026.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex flex-col items-end"
          >
            <span className="font-handwriting text-2xl sm:text-3xl text-amber-300 transform -rotate-2">
              Everything you need to know.
            </span>
          </motion.div>
        </div>

        {/* FAQ Container (Light Golden) */}
        <div 
          className="max-w-3xl mx-auto rounded-2xl px-3 sm:px-8 md:px-10 py-7 sm:py-10 md:py-12 shadow-lg relative"
          style={{ background: 'linear-gradient(135deg, #FFF3D4 0%, #E8D08B 100%)' }}
        >
          {/* Category Filter Pills */}
          <div className="relative z-10 mb-4 sm:mb-5">
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {filterOptions.map((option) => {
                const isActive = activeFilter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setActiveFilter(option)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-sans font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-sm'
                        : 'bg-transparent text-[#0A2540]/80 border-[#C8B89A]/70 hover:bg-[#0A2540]/8 hover:border-[#0A2540]/30'
                    }`}
                    aria-pressed={isActive}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2 relative z-10 my-1">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const originalIdx = faqs.findIndex((item) => item.question === faq.question);
                const isOpen = openIndex === originalIdx;
                return (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.03 }}
                    className={`overflow-hidden transition-colors border-b border-[#C8B89A]/50 last:border-b-0 ${
                      isOpen ? 'bg-[#0A2540]/5 rounded-xl border-transparent' : 'hover:bg-[#0A2540]/5 rounded-xl'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(originalIdx)}
                      className="w-full p-3.5 sm:p-5 sm:p-6 text-left flex items-center justify-between gap-2.5 sm:gap-4 focus:outline-none cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3.5">
                        <span className="font-mono text-[11px] sm:text-xs font-bold text-[#0A2540] bg-[#0A2540]/10 px-1.5 sm:px-2 py-0.5 rounded border border-[#0A2540]/20 shrink-0">
                          Q
                        </span>
                        <span className="font-sans font-bold text-xs sm:text-base md:text-[1.05rem] text-[#0A2540] leading-snug">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-[#0A2540] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-3.5 sm:px-6 pb-4 sm:pb-5 pt-1.5 sm:pt-2 border-t border-[#C8B89A]/30 text-xs sm:text-sm text-[#0A2540]/80 leading-relaxed pl-3.5 sm:pl-12 whitespace-pre-line font-medium">
                        {faq.answer}
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="py-8 sm:py-10 text-center flex flex-col items-center justify-center">
                <p className="text-sm sm:text-base font-semibold text-[#0A2540]/80 mb-1 font-sans">
                  No questions found.
                </p>
                <p className="text-xs text-[#0A2540]/60 mb-3.5 font-sans">
                  Try adjusting your search keywords or category filter.
                </p>

              </div>
            )}
          </div>
        </div>

        {/* Still Have Questions Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mt-12 p-6 rounded-2xl bg-white/10 border border-white/15 md:backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">
                Have more specific queries?
              </h4>
              <p className="text-xs text-white/70">
                Reach out directly to the IEEE SLRTCE Organizing Committee.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="shrink-0 bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5"
          >
            <span>Contact Committee</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
