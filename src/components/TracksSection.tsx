import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const sdgDetails: Record<number, { title: string; color: string }> = {
  1: { title: 'No Poverty', color: '#E5243B' },
  3: { title: 'Good Health & Well-being', color: '#4C9F38' },
  4: { title: 'Quality Education', color: '#C5192D' },
  5: { title: 'Gender Equality', color: '#FF3A21' },
  6: { title: 'Clean Water & Sanitation', color: '#26BDE2' },
  7: { title: 'Affordable & Clean Energy', color: '#FCC30B' },
  8: { title: 'Decent Work & Economic Growth', color: '#A21942' },
  9: { title: 'Industry, Innovation & Infrastructure', color: '#FD6925' },
  10: { title: 'Reduced Inequalities', color: '#DD1367' },
  11: { title: 'Sustainable Cities & Communities', color: '#FD9D24' },
  12: { title: 'Responsible Consumption & Production', color: '#BF8B2E' },
  13: { title: 'Climate Action', color: '#3F7E44' },
  16: { title: 'Peace, Justice & Strong Institutions', color: '#00689D' },
};

const themes = [
  { id: 'ai', title: 'AI / ML', image: '/themes/ai_ml.jpg', color: 'bg-[#1E3A8A]', sdgs: [4, 8, 9, 10], description: 'Artificial Intelligence & Machine Learning driving future innovations' },
  { id: 'iot', title: 'IoT', image: '/themes/iot.jpg', color: 'bg-[#0F172A]', sdgs: [9, 11, 12], description: 'Internet of Things connecting smart systems and infrastructure' },
  { id: 'health', title: 'Healthcare & MedTech', image: '/themes/health.jpg', color: 'bg-[#9F1239]', sdgs: [3, 5, 10], description: 'Medical technologies and intelligent healthcare diagnostics' },
  { id: 'sus', title: 'Sustainability', image: '/themes/sustainability.jpg', color: 'bg-tricolor-green', sdgs: [6, 7, 11, 12, 13], description: 'Eco-innovations, renewable energy and climate preservation' },
  { id: 'cyber', title: 'Cybersecurity', image: '/themes/cybersecurity.jpg', color: 'bg-[#1E40AF]', sdgs: [9, 16], description: 'Information security, cryptographic protocols and threat defense' },
  { id: 'auto', title: 'Automation', image: '/themes/automation.jpg', color: 'bg-brand-orange', sdgs: [8, 9, 12], description: 'Intelligent automation, robotics and industrial engineering' },
  { id: 'fintech', title: 'FinTech', image: '/themes/fintech.jpg', color: 'bg-[#D97706]', sdgs: [1, 8, 9, 10], description: 'Financial technologies, digital transactions and inclusion' },
  { id: 'block', title: 'Blockchain', image: '/themes/blockchain.jpg', color: 'bg-[#2563EB]', sdgs: [9, 16], description: 'Decentralized ledgers, smart contracts and trust systems' },
  { id: 'emerge', title: 'Emerging Technologies', image: '/themes/emerging.jpg', color: 'bg-[#5B21B6]', sdgs: [4, 8, 9, 11], description: 'Frontier science, quantum computing and novel domains' },
];

const trackRows = [
  {
    label: 'Tracks 01 – 03',
    sublabel: 'Core Computing, IoT & Health Sciences',
    items: themes.slice(0, 3), // Row 1
  },
  {
    label: 'Tracks 04 – 06',
    sublabel: 'Sustainable Systems, Security & Automation',
    items: themes.slice(3, 6), // Row 2
  },
  {
    label: 'Tracks 07 – 09',
    sublabel: 'FinTech, Web3 & Frontier Technologies',
    items: themes.slice(6, 9), // Row 3
  },
];

/* Reusable Flippable Stamp Card Content */
const StampCardContent = ({
  theme,
  index,
  isFlipped,
}: {
  theme: typeof themes[0];
  index: number;
  isFlipped: boolean;
}) => {
  return (
    <div
      className="w-full h-full relative preserve-3d transition-transform duration-700 ease-out motion-reduce:transition-none motion-reduce:duration-0"
      style={{
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}
    >
      {/* FRONT SIDE */}
      <div className="absolute inset-0 w-full h-full backface-hidden">
        <div className="stamp-card w-full h-full flex flex-col !p-2 sm:!p-2.5 shadow-xl">
          <div className="flex-grow relative overflow-hidden flex flex-col bg-white rounded-[3px] border border-[#D8CFC0]">

            {/* Artwork / Image Area */}
            <div className={`${theme.color} w-full h-[68%] sm:h-[70%] flex items-center justify-center relative overflow-hidden`}>
              <img
                src={theme.image}
                alt={theme.title}
                className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Tactile Texture overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stucco.png')] opacity-20  pointer-events-none z-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none z-20" />

              {/* Track Index Badge */}
              <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-30 bg-black/65 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-sm border border-amber-300/40 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                <span className="font-mono text-[0.62rem] sm:text-[0.7rem] font-bold text-amber-300 tracking-wider uppercase">
                  Track 0{index + 1}
                </span>
              </div>

              {/* Flip Badge Indicator */}
              <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-30 bg-[#0A2A5E]/85 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1 text-[0.62rem] sm:text-[0.68rem] text-white font-medium group-hover:bg-[#FF6B00] transition-colors">
                <span>UN SDGs</span>
                <span className="text-[0.75rem] leading-none">↻</span>
              </div>

              {/* Bottom Badges on Image */}
              <div className="absolute bottom-1.5 left-2 right-2 sm:bottom-2 sm:left-2.5 sm:right-2.5 z-30 flex items-center justify-between text-white/90 text-[0.65rem] sm:text-[0.7rem] font-sans">
                <span className="bg-black/50 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded text-[0.62rem] sm:text-[0.68rem] font-medium">
                  {theme.sdgs.length} Aligned SDGs
                </span>
                <span className="text-white/80 text-[0.6rem] sm:text-[0.65rem] italic">
                  Tap to view
                </span>
              </div>
            </div>

            {/* Lower Title Area */}
            <div className="h-[32%] sm:h-[30%] bg-[#FCF9F2] flex flex-col justify-center px-3 sm:px-4 py-2 sm:py-3 border-t border-[#E8E1D5]">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span className="font-mono text-[0.6rem] sm:text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider">
                  Colloquium Track
                </span>
                <div className="flex items-center gap-1">
                  {theme.sdgs.map((sdg) => (
                    <span
                      key={sdg}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full inline-block"
                      style={{ backgroundColor: sdgDetails[sdg]?.color || '#0A2A5E' }}
                      title={`SDG ${sdg}: ${sdgDetails[sdg]?.title}`}
                    />
                  ))}
                </div>
              </div>

              <h4 className="font-bold text-brand-navy text-sm sm:text-base lg:text-[1.15rem] leading-tight font-sans">
                {theme.title}
              </h4>

              <div className="mt-1 flex items-center text-[0.65rem] sm:text-[0.72rem] text-[#FF6B00] font-semibold">
                <span>Tap to view UN SDGs</span>
                <span className="ml-1 text-xs">→</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BACK SIDE (UN SDG Images) */}
      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
        <div className="stamp-card w-full h-full flex flex-col !p-2 sm:!p-2.5 shadow-xl bg-[#FBF7EE]">
          <div className="flex-grow flex flex-col justify-between bg-[#F8F4EA] rounded-[3px] border border-[#D8CFC0] p-3 sm:p-4">

            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-[#E2D8C7]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-tricolor-green" />
                <span className="font-mono text-[0.62rem] sm:text-[0.68rem] font-bold text-brand-navy uppercase tracking-wider">
                  UN Sustainable Goals
                </span>
              </div>
              <span className="font-mono text-[0.6rem] sm:text-[0.65rem] text-slate-500">
                Track 0{index + 1}
              </span>
            </div>

            {/* SDG Badges Grid */}
            <div className="flex-grow flex items-center justify-center py-1 sm:py-2">
              {/* 2 SDGs */}
              {theme.sdgs.length <= 2 && (
                <div className="flex justify-center gap-3 sm:gap-4">
                  {theme.sdgs.map((sdg) => (
                    <div key={sdg} className="group/sdg flex flex-col items-center">
                      <img
                        src={`/sdg/sdg-${sdg}.svg`}
                        alt={`UN SDG ${sdg}: ${sdgDetails[sdg]?.title}`}
                        title={`SDG ${sdg}: ${sdgDetails[sdg]?.title}`}
                        className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 border border-black/10 bg-white"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 3 SDGs */}
              {theme.sdgs.length === 3 && (
                <div className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-[220px] sm:max-w-[260px]">
                  <div className="flex justify-center gap-2 sm:gap-3 w-full">
                    {theme.sdgs.slice(0, 2).map((sdg) => (
                      <div key={sdg} className="group/sdg flex flex-col items-center">
                        <img
                          src={`/sdg/sdg-${sdg}.svg`}
                          alt={`UN SDG ${sdg}: ${sdgDetails[sdg]?.title}`}
                          title={`SDG ${sdg}: ${sdgDetails[sdg]?.title}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-md shadow-md hover:scale-105 transition-transform duration-200 border border-black/10 bg-white"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center w-full">
                    <div className="group/sdg flex flex-col items-center">
                      <img
                        src={`/sdg/sdg-${theme.sdgs[2]}.svg`}
                        alt={`UN SDG ${theme.sdgs[2]}: ${sdgDetails[theme.sdgs[2]]?.title}`}
                        title={`SDG ${theme.sdgs[2]}: ${sdgDetails[theme.sdgs[2]]?.title}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-md shadow-md hover:scale-105 transition-transform duration-200 border border-black/10 bg-white"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4 SDGs */}
              {theme.sdgs.length === 4 && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-[220px] sm:max-w-[260px] place-items-center">
                  {theme.sdgs.map((sdg) => (
                    <div key={sdg} className="group/sdg flex flex-col items-center">
                      <img
                        src={`/sdg/sdg-${sdg}.svg`}
                        alt={`UN SDG ${sdg}: ${sdgDetails[sdg]?.title}`}
                        title={`SDG ${sdg}: ${sdgDetails[sdg]?.title}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-md shadow-md hover:scale-105 transition-transform duration-200 border border-black/10 bg-white"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 5 SDGs */}
              {theme.sdgs.length >= 5 && (
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-[280px] sm:max-w-[320px]">
                  {theme.sdgs.map((sdg) => (
                    <div key={sdg} className="group/sdg flex flex-col items-center">
                      <img
                        src={`/sdg/sdg-${sdg}.svg`}
                        alt={`UN SDG ${sdg}: ${sdgDetails[sdg]?.title}`}
                        title={`SDG ${sdg}: ${sdgDetails[sdg]?.title}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md shadow-md hover:scale-105 transition-transform duration-200 border border-black/10 bg-white"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[#E2D8C7] flex items-center justify-between text-[0.62rem] sm:text-[0.68rem] text-slate-600 font-sans">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-tricolor-green inline-block" />
                INSPIRE Colloquium
              </span>
              <span className="text-[#FF6B00] font-semibold flex items-center gap-1 hover:underline">
                Flip back ↺
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* Desktop Theme Stamp Card */
const ThemeStamp = ({
  theme,
  index,
  colIndex,
}: {
  theme: typeof themes[0];
  index: number;
  colIndex: number;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotation = index % 2 === 0 ? 1.5 : -1.5;

  return (
    <motion.div
      className="w-full max-w-[270px] sm:max-w-[330px] md:max-w-[360px] lg:max-w-[380px]"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: colIndex * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="relative group cursor-pointer w-full perspective-1000 select-none"
        whileHover={{
          y: -6,
          rotate: 0,
          scale: 1.02,
          transition: { duration: 0.25 },
        }}
        style={{ rotate: rotation }}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setIsFlipped((prev) => !prev)}
        onFocus={() => setIsFlipped(true)}
        onBlur={() => setIsFlipped(false)}
        tabIndex={0}
        role="button"
        aria-label={`${theme.title} - UN SDGs: ${theme.sdgs.map((s) => 'SDG ' + s).join(', ')}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsFlipped((prev) => !prev);
          }
        }}
      >
        <div className="w-full h-[335px] sm:h-[390px] md:h-[430px]">
          <StampCardContent theme={theme} index={index} isFlipped={isFlipped} />
        </div>
      </motion.div>
    </motion.div>
  );
};

/* Mobile 3D Spinning Cover Flow Carousel */
const Mobile3DTracksCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const count = themes.length;

  const handleSelect = (newIndex: number) => {
    const normalized = ((newIndex % count) + count) % count;
    setIsFlipped(false);
    setActiveIndex(normalized);
  };

  const handleNext = () => handleSelect(activeIndex + 1);
  const handlePrev = () => handleSelect(activeIndex - 1);

  // Auto-advance card every 5 seconds, but pause completely when flipped to view UN SDGs
  useEffect(() => {
    if (isFlipped) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 5000);

    return () => clearInterval(timer);
  }, [isFlipped, activeIndex, count]);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -250) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 250) {
      handlePrev();
    }
  };

  const activeTheme = themes[activeIndex];

  return (
    <div className="w-full flex flex-col items-center relative py-4">
      {/* 3D Cover Flow Viewport */}
      <motion.div
        className="relative w-full max-w-[390px] h-[370px] sm:h-[410px] flex items-center justify-center overflow-visible touch-pan-y"
        style={{ perspective: 1100 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
      >
        {themes.map((theme, index) => {
          let diff = index - activeIndex;
          if (diff > count / 2) diff -= count;
          if (diff < -count / 2) diff += count;

          const isCurrent = diff === 0;
          const isPrev = diff === -1;
          const isNext = diff === 1;
          const isVisible = Math.abs(diff) <= 2;

          if (!isVisible) return null;

          // 3D positioning matching video reference
          let xOffset = 0;
          let zOffset = 0;
          let rotateY = 0;
          let rotateZ = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 30;

          if (isCurrent) {
            xOffset = 0;
            zOffset = 0;
            rotateY = 0;
            rotateZ = 0;
            scale = 1;
            opacity = 1;
            zIndex = 30;
          } else if (isNext) {
            xOffset = 135;
            zOffset = -100;
            rotateY = -30;
            rotateZ = 3;
            scale = 0.82;
            opacity = 0.45;
            zIndex = 20;
          } else if (isPrev) {
            xOffset = -135;
            zOffset = -100;
            rotateY = 30;
            rotateZ = -3;
            scale = 0.82;
            opacity = 0.45;
            zIndex = 20;
          } else if (diff === 2) {
            xOffset = 220;
            zOffset = -220;
            rotateY = -45;
            rotateZ = 5;
            scale = 0.65;
            opacity = 0;
            zIndex = 10;
          } else if (diff === -2) {
            xOffset = -220;
            zOffset = -220;
            rotateY = 45;
            rotateZ = -5;
            scale = 0.65;
            opacity = 0;
            zIndex = 10;
          }

          return (
            <motion.div
              key={theme.id}
              className="absolute w-[255px] sm:w-[290px] h-[330px] sm:h-[375px] cursor-pointer select-none"
              animate={{
                x: xOffset,
                z: zOffset,
                rotateY,
                rotateZ,
                scale,
                opacity,
              }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 24,
                mass: 0.8,
              }}
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              onClick={() => {
                if (isCurrent) {
                  setIsFlipped(!isFlipped);
                } else if (isNext) {
                  handleNext();
                } else if (isPrev) {
                  handlePrev();
                }
              }}
            >
              <StampCardContent
                theme={theme}
                index={index}
                isFlipped={isCurrent && isFlipped}
              />
            </motion.div>
          );
        })}

        {/* Circular Left Navigation Arrow (Matching video reference) */}
        <button
          onClick={handlePrev}
          aria-label="Previous Track"
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/75 hover:bg-black/90 border border-white/25 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Circular Right Navigation Arrow (Matching video reference) */}
        <button
          onClick={handleNext}
          aria-label="Next Track"
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </motion.div>

      {/* Information Area Below Active Card */}
      <div className="flex flex-col items-center mt-5 px-4 text-center max-w-sm">
        {/* Active Title */}
        <AnimatePresence mode="wait">
          <motion.h3
            key={activeTheme.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider leading-tight"
          >
            {activeTheme.title}
          </motion.h3>
        </AnimatePresence>

        {/* Active Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeTheme.description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xs sm:text-sm text-blue-100/80 mt-1.5 leading-relaxed font-sans line-clamp-2"
          >
            {activeTheme.description}
          </motion.p>
        </AnimatePresence>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {themes.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              aria-label={`Go to Track ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${i === activeIndex
                  ? 'w-6 h-1.5 bg-amber-400'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TracksSection = () => {
  return (
    <section
      id="tracks"
      className="py-16 md:py-24 relative overflow-hidden bg-cover bg-center border-t border-b border-black/10 text-white scroll-mt-[65px] w-full max-w-full"
      style={{
        backgroundImage: "url('/backgrounds/bg-cyan-n.jpg')",
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Tactile Fine Grain Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: "url('/backgrounds/noise-texture.svg')",
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Subtle Vignette for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/30 z-0" />

      <div className="max-w-[1360px] w-full mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 md:mb-16 max-w-xl"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">Tracks</h2>
          <div className="w-16 h-[3px] bg-amber-400 rounded-full mb-3" />
          <p className="text-sm sm:text-base text-blue-100/80 font-sans">
            Explore multidisciplinary domains that drive innovation for a Viksit Bharat. There are in total 9 Tracks.
          </p>
        </motion.div>

        {/* MOBILE 3D SPINNING CAROUSEL (< lg) */}
        <div className="block lg:hidden w-full">
          <Mobile3DTracksCarousel />
        </div>

        {/* DESKTOP GRID (>= lg): Rows of Tracks */}
        <div className="hidden lg:flex flex-col gap-14 sm:gap-18 md:gap-22 lg:gap-28 w-full">
          {trackRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-col justify-center items-center w-full"
            >
              {/* Row Header Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between w-full max-w-[1240px] mb-6 sm:mb-7 pb-2.5 border-b border-white/20"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-amber-300 bg-black/45 px-3 py-1 rounded border border-amber-300/35 uppercase tracking-wider">
                    {row.label}
                  </span>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white/95 font-sans">
                    {row.sublabel}
                  </h3>
                </div>
              </motion.div>

              {/* 3 Tracks in this Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9 lg:gap-10 xl:gap-12 w-full max-w-[1240px] place-items-center">
                {row.items.map((theme, colIndex) => (
                  <ThemeStamp
                    key={theme.id}
                    theme={theme}
                    index={rowIndex * 3 + colIndex}
                    colIndex={colIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TracksSection;

