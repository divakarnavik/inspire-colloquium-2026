import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

// All critical website assets to preload locally before entering
const ASSETS_TO_PRELOAD = [
  // Backgrounds & Textures
  '/hero-heritage-bg.webp',
  '/hero-bg.webp',
  '/backgrounds/bg-blue-n.jpg',
  '/backgrounds/bg-teal-n.jpg',
  '/backgrounds/bg-purple-n.jpg',
  '/backgrounds/bg-gold-n.jpg',
  '/backgrounds/bg-cyan-n.jpg',
  '/backgrounds/bg-saffron-n.jpg',
  '/backgrounds/bg-lemon-yellow-n.jpg',
  '/backgrounds/bg-maroon-n.jpg',
  '/cta-college-bg.webp',
  '/paper-texture-clean.webp',
  '/backgrounds/paper-texture-clean.webp',
  '/backgrounds/noise-texture.svg',

  // Logos & Core Graphics
  '/slrtce-actual-photo.webp',
  '/CompEng-sticker.webp',
  '/LOGO-IEEE.webp',
  '/slrtce-logo.webp',
  '/ieee-custom-logo-white.webp',
  '/ieee-slrtce-logo.webp',
  '/department-logo.webp',
  '/apj-abdul-kalam-transparent.webp',
  '/heritage-combined-transparent.webp',

  // Characters & Badges
  '/images/participants/ug_new_character.png',
  '/images/participants/ug_new_bg.webp',
  '/images/participants/pg_new_character.png',
  '/images/participants/pg_new_bg.png',
  '/images/participants/ppg_new_character.webp',
  '/images/participants/bg_new_scientist.webp',

  // Theme Tracks
  '/themes/ai_ml.jpg',
  '/themes/iot.jpg',
  '/themes/health.jpg',
  '/themes/sustainability.jpg',
  '/themes/cybersecurity.jpg',
  '/themes/automation.jpg',
  '/themes/fintech.jpg',
  '/themes/blockchain.jpg',
  '/themes/emerging.jpg',
  // SDG Icons (1 to 17)
  ...Array.from({ length: 17 }, (_, i) => `/sdg/sdg-${i + 1}.svg`),
  
  // External Patterns
  '//www.transparenttextures.com/patterns/handmade-paper.png',
  '//www.transparenttextures.com/patterns/stucco.png',
];

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const displayProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const totalItems = ASSETS_TO_PRELOAD.length + 2; // +1 for fonts, +1 for chunks

    const updateProgress = () => {
      loadedCount++;
      const currentPercent = Math.min(100, Math.round((loadedCount / totalItems) * 100));
      targetProgressRef.current = Math.max(targetProgressRef.current, currentPercent);
      if (loadedCount >= totalItems) {
        isLoadedRef.current = true;
        targetProgressRef.current = 100;
      }
    };

    // 1. Preload Images
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    ASSETS_TO_PRELOAD.forEach((src) => {
      // Standard image cache preload
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = updateProgress; // Resolve even on missing file so loader never hangs
      
      // Aggressive preload for mobile devices to prevent scrolling lag
      if (isMobile) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }
    });

    // 2. Preload Web Fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateProgress).catch(updateProgress);
    } else {
      updateProgress();
    }

    // 3. Preload Lazy Component Chunks in the background
    Promise.allSettled([
      import('./TracksSection'),
      import('./TimelineSection'),
      import('./PrizePoolSection'),
      import('./FAQSection'),
      import('./Footer'),
      import('./CTASection'),
    ]).then(updateProgress);

    // Safety fallback timeout: maximum 6s so slow connections never get stuck
    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        isLoadedRef.current = true;
        targetProgressRef.current = 100;
      }
    }, 6000);

    // Smooth 0 to 100 progress counter loop
    let animationFrameId: number;
    let startTime: number | null = null;
    const MIN_ANIMATION_DURATION = isMobile ? 0 : 2000; // Minimum 2s for aesthetic reveal on desktop only
    let isFinished = false;

    const tick = (now: number) => {
      if (!isMounted) return;
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      // Time-based smooth minimum progress
      const timeRatio = Math.min(1, elapsed / MIN_ANIMATION_DURATION);
      const minProgressFromTime = Math.round(timeRatio * 90);

      // Effective target is the maximum of real download progress and smooth time curve
      const effectiveTarget = (isLoadedRef.current && elapsed >= MIN_ANIMATION_DURATION)
        ? 100
        : Math.min(99, Math.max(minProgressFromTime, targetProgressRef.current));

      let current = displayProgressRef.current;
      if (current < effectiveTarget) {
        const step = Math.max(1, Math.ceil((effectiveTarget - current) * 0.12));
        current = Math.min(effectiveTarget, current + step);
        displayProgressRef.current = current;
        setDisplayProgress(current);
      }

      if (current >= 100 && isLoadedRef.current && elapsed >= MIN_ANIMATION_DURATION) {
        if (!isFinished) {
          isFinished = true;
          setTimeout(() => {
            if (isMounted) {
              setIsVisible(false);
              setTimeout(onComplete, 800); // Allow exit fade transition
            }
          }, 350);
        }
        return;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  // Letter animation variants
  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.12 + 0.2,
        type: 'spring',
        stiffness: 220,
        damping: 16,
      },
    }),
  };

  const text = 'INSPIRE'.split('');

  // Dynamic progress status caption
  const getStatusText = (progress: number) => {
    if (progress < 30) return 'Initializing Colloquium Archives...';
    if (progress < 65) return 'Preloading Visual Assets & Themes...';
    if (progress < 95) return 'Preparing Exhibits & Schedules...';
    if (progress < 100) return 'Finalizing System Setup...';
    return 'Welcome to INSPIRE';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cover bg-center overflow-hidden bg-[#F5EDCF] select-none"
          style={{ backgroundImage: "url('/hero-heritage-bg.webp')" }}
        >
          {/* Subtle light overlay to ensure text contrast */}
          <div className="absolute inset-0 bg-white/25 pointer-events-none" />

          {/* Center Brand Block */}
          <div className="relative z-10 flex flex-col items-center px-4 max-w-xl text-center">
            {/* Text Animation: INSPIRE */}
            <div className="flex space-x-1 sm:space-x-2 md:space-x-4 mb-2">
              {text.map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-4xl sm:text-6xl md:text-8xl lg:text-[8.5rem] font-black text-[#0A2540] tracking-wider sm:tracking-widest md:drop-shadow-sm leading-none"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="text-teal-800 tracking-[0.25em] sm:tracking-[0.4em] text-[11px] sm:text-base md:text-lg uppercase font-bold md:drop-shadow-xs font-sans mb-8 sm:mb-10"
            >
              A Research &amp; Idea Colloquium
            </motion.div>

            {/* Loading 0 to 100 Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="flex flex-col items-center w-full"
            >
              {/* Numerical Percentage Display */}
              <div className="flex items-baseline justify-center gap-1.5 mb-2.5">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
                  {displayProgress}
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#FF6B00]">
                  %
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-56 xs:w-68 sm:w-80 md:w-96 h-2 sm:h-2.5 bg-[#0A2540]/10 rounded-full p-0.5 border border-[#0A2540]/25 shadow-inner overflow-hidden relative">
                {/* Active Progress Fill */}
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0A2540] via-[#D4AF37] to-[#FF6B00] transition-all duration-150 ease-out relative overflow-hidden shadow-xs"
                  style={{ width: `${displayProgress}%` }}
                >
                  {/* Subtle Light Shimmer Highlight */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-pulse pointer-events-none" />
                </div>
              </div>

              {/* Status Caption */}
              <p className="mt-3 text-[10px] sm:text-xs font-mono text-[#0A2540]/80 tracking-widest uppercase font-semibold h-4">
                {getStatusText(displayProgress)}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
