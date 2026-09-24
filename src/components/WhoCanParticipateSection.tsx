import { useState } from 'react';
import { motion } from 'framer-motion';

interface CategoryInfo {
  title: string;
  degree: string;
  teamSize: string;
  align?: 'left' | 'right' | 'center';
}

interface ParticipantBoxProps {
  imgSrc: string;
  imgWidth?: number;
  imgHeight?: number;
  className?: string;
  bgImage?: string;
  info: CategoryInfo;
  flipImage?: boolean;
  imgClassName?: string;
  flipOnHover?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const ParticipantBox = ({
  imgSrc,
  imgWidth,
  imgHeight,
  className,
  bgImage,
  info,
  flipImage,
  imgClassName,
  flipOnHover,
  isOpen = false,
  onToggle,
}: ParticipantBoxProps) => {
  // Calculate text positioning and character shift
  const isLeft = info.align === 'left';
  const isRight = info.align === 'right';

  const textClass = isLeft
    ? "absolute top-2 sm:top-4 left-2 sm:-left-6 md:-left-12 lg:-left-20 xl:-left-24 w-56 sm:w-68 md:w-80 lg:w-[22rem] xl:w-[25rem] z-30 flex flex-col items-start text-left pointer-events-none"
    : isRight
      ? "absolute top-2 sm:top-4 -right-2 sm:-right-6 md:-right-12 lg:-right-20 xl:-right-24 w-56 sm:w-68 md:w-80 lg:w-[22rem] xl:w-[25rem] z-30 flex flex-col items-start text-left pointer-events-none"
      : "absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-30 flex flex-col items-center text-center pointer-events-none";

  const charShiftX = isLeft ? 85 : isRight ? -85 : 0;

  const hoverScaleX = flipImage
    ? (flipOnHover ? 1.15 : -1.15)
    : (flipOnHover ? -1.15 : 1.15);

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        initial="initial"
        animate={isOpen ? "hover" : "initial"}
        whileHover="hover"
        variants={{
          initial: { zIndex: 10 },
          hover: { zIndex: 50 }
        }}
        onClick={onToggle}
        className={`group relative flex items-center justify-center cursor-pointer select-none ${className}`}
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        {/* The stamp card background (lies down on hover/tap) */}
        <motion.div
          variants={{
            initial: { rotateX: 0, y: 0, scale: 1, opacity: 1 },
            hover: { rotateX: 65, y: 30, scale: 0.95, opacity: 0.6 }
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="absolute inset-0 stamp-card shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#F5F0E6] p-2.5 sm:p-4 origin-bottom"
        >
          {/* Inner frame for the stamp card */}
          <div className="relative w-full h-full overflow-hidden border border-black/10 rounded-sm bg-[#1A202C] flex items-center justify-center">
            {bgImage && (
              <div
                className="absolute inset-0 opacity-60 bg-cover bg-center brightness-105"
                style={{ backgroundImage: `url('${bgImage}')` }}
              />
            )}

            {/* Subtle Glow inside the box */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
          </div>
        </motion.div>

        {/* The Character Image (pops up out of the box on hover/tap) */}
        <motion.img
          variants={{
            initial: { y: 0, x: 0, scaleX: flipImage ? -1 : 1, scaleY: 1 },
            hover: { y: -50, x: charShiftX, scaleX: hoverScaleX, scaleY: 1.15 }
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          src={imgSrc}
          alt={info.title}
          width={imgWidth}
          height={imgHeight}
          className={`relative z-20 md:drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] pointer-events-none ${imgClassName || 'w-full h-full object-contain p-6 sm:p-12'}`}
        />

        {/* Info Text (Revealed on hover/tap) */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20, scale: 0.95, pointerEvents: 'none' },
            hover: { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' }
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.1 }}
          className={textClass}
        >
          <div className="p-2 sm:p-3 md:p-4 w-full">
            <h3 className="text-base sm:text-xl md:text-2xl lg:text-[1.85rem] xl:text-[2.1rem] font-black text-white mb-1.5 md:mb-2 md:drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] leading-tight tracking-tight">
              {info.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base lg:text-[1.1rem] xl:text-[1.2rem] text-amber-300 font-extrabold mb-2.5 md:mb-3 md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              {info.degree}
            </p>
            <div>
              <span className="text-[9.5px] sm:text-[11px] md:text-xs lg:text-[13px] xl:text-[13.5px] text-white bg-black/65 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full inline-block font-bold border border-white/30 shadow-md md:backdrop-blur-sm whitespace-nowrap">
                Team Size: {info.teamSize}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const WhoCanParticipateSection = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleToggle = (cardId: string) => {
    setActiveCard((prev) => (prev === cardId ? null : cardId));
  };

  return (
    <section
      id="eligibility"
      className="py-12 md:py-24 relative overflow-hidden bg-cover bg-center bg-scroll md:bg-fixed border-t border-b border-teal-950/20 w-full min-h-[90vh] flex flex-col justify-center"
      style={{
        backgroundImage: "url('/backgrounds/bg-saffron-n.jpg')",
      }}
    >
      {/* Tactile Fine Grain Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: "url('/backgrounds/noise-texture.svg')",
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/25 via-transparent to-black/35 z-0" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center">

        {/* Top Left Header Section */}
        <div className="max-w-3xl mb-8 md:mb-14 relative z-20 self-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight md:drop-shadow-md mb-2">
              Who Can Participate?
            </h2>
            <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mb-3" />
            <p className="text-xs sm:text-base text-white/90 font-sans leading-relaxed font-medium md:drop-shadow-sm">
              Review our eligibility criteria below to find the right category for you and your team.{' '}
              <span className="md:hidden font-bold text-amber-200">Tap on any card to view details.</span>
              <span className="hidden md:inline font-bold text-amber-200">Hover on card to see more detail.</span>
            </p>
          </motion.div>
        </div>

        <div className="w-full max-w-5xl flex flex-col gap-6 md:gap-10 items-center">

          {/* ROW 1: Ideathon (UG & Diploma Students) */}
          <div className="flex flex-col items-center w-full">
            {/* Bullet Heading: Ideathon */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2.5 sm:gap-3.5 self-start mb-4 sm:mb-6"
            >
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] ring-4 ring-amber-400/20 shrink-0" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-black text-white tracking-[0.16em] uppercase md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Ideathon
              </h3>
              <div className="h-[2px] bg-gradient-to-r from-amber-400/60 via-amber-400/20 to-transparent flex-1 ml-2 min-w-[60px] sm:min-w-[120px] max-w-[200px]" />
            </motion.div>

            <ParticipantBox
              imgSrc="/images/participants/ug_new_character.png"
              bgImage="/images/participants/ug_new_bg.webp"
              imgWidth={500}
              imgHeight={500}
              className="w-full max-w-3xl h-[280px] sm:h-[350px] md:h-[420px]"
              isOpen={activeCard === 'ug'}
              onToggle={() => handleToggle('ug')}
              info={{
                title: 'UG & Diploma Students',
                degree: 'B.E. / B.Tech / Diploma (All Years)',
                teamSize: '2 to 4 Members',
                align: 'left'
              }}
            />
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 sm:mt-16 md:mt-20 text-xl sm:text-3xl md:text-4xl font-cinzel font-black text-white tracking-[0.14em] uppercase text-center md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            >
              UG / Diploma
            </motion.h4>
          </div>

          {/* ROW 2: Research (PG & PhD Scholars) */}
          <div className="w-full flex flex-col items-center mt-6 sm:mt-10 md:mt-12">
            {/* Bullet Heading: Research */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2.5 sm:gap-3.5 self-start mb-4 sm:mb-6"
            >
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] ring-4 ring-amber-400/20 shrink-0" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-black text-white tracking-[0.16em] uppercase md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Research
              </h3>
              <div className="h-[2px] bg-gradient-to-r from-amber-400/60 via-amber-400/20 to-transparent flex-1 ml-2 min-w-[60px] sm:min-w-[120px] max-w-[200px]" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-14 md:gap-20 w-full max-w-5xl">
              {/* Left: Postgraduate (PG) */}
              <div className="flex flex-col items-center w-full">
                <ParticipantBox
                  imgSrc="/images/participants/pg_new_character.png"
                  bgImage="/images/participants/pg_new_bg.png"
                  imgWidth={500}
                  imgHeight={500}
                  className="w-full h-[250px] sm:h-[300px] md:h-[350px]"
                  isOpen={activeCard === 'pg'}
                  onToggle={() => handleToggle('pg')}
                  info={{
                    title: 'Postgraduate (PG) Scholars',
                    degree: 'M.E. / M.Tech / M.S. / MCA',
                    teamSize: 'Individual Submission',
                    align: 'left'
                  }}
                />
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-10 sm:mt-10 md:mt-12 text-xl sm:text-3xl md:text-4xl font-cinzel font-black text-white tracking-[0.16em] uppercase text-center md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                >
                  PG
                </motion.h4>
              </div>

              {/* Right: PhD Scholars (PPG) */}
              <div className="flex flex-col items-center w-full">
                <ParticipantBox
                  imgSrc="/images/participants/ppg_new_character.webp"
                  bgImage="/images/participants/bg_new_scientist.webp"
                  imgWidth={500}
                  imgHeight={500}
                  className="w-full h-[250px] sm:h-[300px] md:h-[350px]"
                  flipImage={false}
                  imgClassName="absolute bottom-2 -left-2 sm:-left-4 md:-left-8 w-[48%] sm:w-[42%] md:w-[38%] h-auto max-h-[78%] object-contain"
                  isOpen={activeCard === 'ppg'}
                  onToggle={() => handleToggle('ppg')}
                  info={{
                    title: 'PhD Scholars',
                    degree: 'Ph.D. / Researchers / Fellows',
                    teamSize: 'Individual Submission',
                    align: 'right'
                  }}
                />
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-10 sm:mt-10 md:mt-12 text-xl sm:text-3xl md:text-4xl font-cinzel font-black text-white tracking-[0.16em] uppercase text-center md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                >
                  PhD
                </motion.h4>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhoCanParticipateSection;
