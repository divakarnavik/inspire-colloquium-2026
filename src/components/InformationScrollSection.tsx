import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const PANEL_COUNT = 3;
const SCROLL_THRESHOLD = 25; // Snappy scroll gesture triggers snap
const ANIMATION_DURATION = 600; // Snappy, smooth panel transition (0.6s)
const COOLDOWN_AFTER_ANIMATION = 100; // Brief buffer after animation ends
const TOTAL_LOCK_TIME = ANIMATION_DURATION + COOLDOWN_AFTER_ANIMATION; // 700ms total lock

// Ghost Perforated Outline Border for Stamp Cards (Scalloped Stamp Perforation Border in Background)
const PerforatedGhostOutline = ({
  insetClass,
  opacityClass,
  idPrefix,
}: {
  insetClass: string;
  opacityClass: string;
  idPrefix: string;
}) => (
  <div className={`absolute ${insetClass} ${opacityClass} pointer-events-none -z-10 overflow-visible`}>
    <svg className="w-0 h-0 absolute pointer-events-none" aria-hidden="true">
      <defs>
        {/* Top scalloped tooth pattern: baseline at y=10, teeth arching outward to y=3 */}
        <pattern id={`${idPrefix}-top`} width="18" height="10" patternUnits="userSpaceOnUse">
          <path d="M 0 10 L 2 10 A 7 7 0 0 1 16 10 L 18 10" fill="none" stroke="white" strokeWidth="1.25" />
        </pattern>
        {/* Bottom scalloped tooth pattern: baseline at y=0, teeth arching outward to y=7 */}
        <pattern id={`${idPrefix}-bot`} width="18" height="10" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 2 0 A 7 7 0 0 0 16 0 L 18 0" fill="none" stroke="white" strokeWidth="1.25" />
        </pattern>
        {/* Left scalloped tooth pattern: baseline at x=10, teeth arching outward to x=3 */}
        <pattern id={`${idPrefix}-left`} width="10" height="18" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 10 2 A 7 7 0 0 0 10 16 L 10 18" fill="none" stroke="white" strokeWidth="1.25" />
        </pattern>
        {/* Right scalloped tooth pattern: baseline at x=0, teeth arching outward to x=7 */}
        <pattern id={`${idPrefix}-right`} width="10" height="18" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 0 2 A 7 7 0 0 1 0 16 L 0 18" fill="none" stroke="white" strokeWidth="1.25" />
        </pattern>
      </defs>
    </svg>

    {/* Top scalloped border */}
    <div className="absolute top-0 left-2.5 right-2.5 h-2.5 overflow-hidden">
      <svg className="w-full h-full">
        <rect width="100%" height="10" fill={`url(#${idPrefix}-top)`} />
      </svg>
    </div>

    {/* Bottom scalloped border */}
    <div className="absolute bottom-0 left-2.5 right-2.5 h-2.5 overflow-hidden">
      <svg className="w-full h-full">
        <rect width="100%" height="10" fill={`url(#${idPrefix}-bot)`} />
      </svg>
    </div>

    {/* Left scalloped border */}
    <div className="absolute top-2.5 bottom-2.5 left-0 w-2.5 overflow-hidden">
      <svg className="w-full h-full">
        <rect width="10" height="100%" fill={`url(#${idPrefix}-left)`} />
      </svg>
    </div>

    {/* Right scalloped border */}
    <div className="absolute top-2.5 bottom-2.5 right-0 w-2.5 overflow-hidden">
      <svg className="w-full h-full">
        <rect width="10" height="100%" fill={`url(#${idPrefix}-right)`} />
      </svg>
    </div>

    {/* 4 Corner joints */}
    <svg className="absolute top-0 left-0 w-2.5 h-2.5 pointer-events-none">
      <path d="M 2.5 10 L 2.5 2.5 L 10 2.5" fill="none" stroke="white" strokeWidth="1.25" />
    </svg>
    <svg className="absolute top-0 right-0 w-2.5 h-2.5 pointer-events-none">
      <path d="M 0 2.5 L 7.5 2.5 L 7.5 10" fill="none" stroke="white" strokeWidth="1.25" />
    </svg>
    <svg className="absolute bottom-0 left-0 w-2.5 h-2.5 pointer-events-none">
      <path d="M 2.5 0 L 2.5 7.5 L 10 7.5" fill="none" stroke="white" strokeWidth="1.25" />
    </svg>
    <svg className="absolute bottom-0 right-0 w-2.5 h-2.5 pointer-events-none">
      <path d="M 0 7.5 L 7.5 7.5 L 7.5 0" fill="none" stroke="white" strokeWidth="1.25" />
    </svg>
  </div>
);

const InformationScrollSection = () => {
  const [activePanel, setActivePanel] = useState(0);
  const activePanelRef = useRef(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const isLockedRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  // Detect mobile screen (< 1024px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dynamically get the exact navbar height
  const getNavbarHeight = useCallback(() => {
    const header = document.querySelector('header');
    return header ? header.getBoundingClientRect().height : 65;
  }, []);

  // Check if the sticky content is currently pinned in the viewport (Desktop only)
  const isStickyPinned = useCallback(() => {
    if (isMobile) return false;
    const outer = outerRef.current;
    if (!outer) return false;
    const rect = outer.getBoundingClientRect();
    const navbarHeight = getNavbarHeight();
    const viewportH = window.innerHeight - navbarHeight;

    return rect.top <= navbarHeight + 20 && rect.bottom >= navbarHeight + viewportH - 20;
  }, [getNavbarHeight, isMobile]);

  // Scroll the window so the outer wrapper position matches the target panel (Desktop only)
  const scrollToPanel = useCallback((panelIndex: number) => {
    const outer = outerRef.current;
    if (!outer) return;
    const navbarHeight = getNavbarHeight();
    const viewportH = window.innerHeight - navbarHeight;
    const totalScroll = outer.offsetHeight - viewportH;
    const zonePerPanel = totalScroll / PANEL_COUNT;

    // Scroll to the middle of this panel's zone so we're firmly inside it
    const targetScrollTop = outer.offsetTop + (panelIndex * zonePerPanel) + (zonePerPanel / 2);
    window.scrollTo({ top: targetScrollTop, behavior: 'auto' });
  }, [getNavbarHeight]);

  // Navigate to a target panel with responsive animation and lock
  const goToPanel = useCallback((targetIndex: number, shouldScrollWindow: boolean = true) => {
    if (targetIndex < 0 || targetIndex >= PANEL_COUNT) return;
    if (isLockedRef.current) return;

    isLockedRef.current = true;
    accumulatedDeltaRef.current = 0;

    setActivePanel(targetIndex);
    activePanelRef.current = targetIndex;

    // Only sync window scroll position on desktop sticky scroll, never on mobile
    if (shouldScrollWindow && !isMobile) {
      scrollToPanel(targetIndex);
    }

    setTimeout(() => {
      isLockedRef.current = false;
      accumulatedDeltaRef.current = 0;
    }, TOTAL_LOCK_TIME);
  }, [scrollToPanel, isMobile]);

  // Auto-slide logic for mobile view has been removed as per user request

  // Wheel interception: intercept scroll when pinned, snap panels cleanly (Desktop only)
  useEffect(() => {
    if (isMobile) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 5) return;

      if (!isStickyPinned()) return;

      if (isLockedRef.current) {
        e.preventDefault();
        accumulatedDeltaRef.current = 0;
        return;
      }

      if (e.deltaY > 0) {
        // Scrolling DOWN
        if (activePanelRef.current < PANEL_COUNT - 1) {
          e.preventDefault();
          accumulatedDeltaRef.current += e.deltaY;

          if (accumulatedDeltaRef.current >= SCROLL_THRESHOLD) {
            goToPanel(activePanelRef.current + 1);
          }
        } else {
          // At last panel (IEEE) — allow native scroll to proceed to About Colloquium
          accumulatedDeltaRef.current = 0;
        }
      } else if (e.deltaY < 0) {
        // Scrolling UP
        if (activePanelRef.current > 0) {
          e.preventDefault();
          accumulatedDeltaRef.current += e.deltaY;

          if (accumulatedDeltaRef.current <= -SCROLL_THRESHOLD) {
            goToPanel(activePanelRef.current - 1);
          }
        } else {
          // At first panel (Our College) — allow native scroll to proceed back to Hero
          accumulatedDeltaRef.current = 0;
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [goToPanel, isStickyPinned, isMobile]);

  // Sync panel state when user scrolls (Desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (isLockedRef.current) return;
      const outer = outerRef.current;
      if (!outer) return;

      const rect = outer.getBoundingClientRect();
      const navbarHeight = getNavbarHeight();
      const viewportH = window.innerHeight - navbarHeight;

      // If user has scrolled above the section (back to Hero), reset to panel 0
      if (rect.top > navbarHeight + 50) {
        if (activePanelRef.current !== 0) {
          setActivePanel(0);
          activePanelRef.current = 0;
          accumulatedDeltaRef.current = 0;
        }
      } else if (rect.top <= navbarHeight + 10 && rect.bottom >= navbarHeight + viewportH - 10) {
        // Pinned sticky range: calculate active panel directly from scroll position
        const totalScrollable = outer.offsetHeight - viewportH;
        if (totalScrollable > 0) {
          const scrollProgress = Math.max(0, Math.min(1, (navbarHeight - rect.top) / totalScrollable));
          const targetPanel = Math.min(PANEL_COUNT - 1, Math.floor(scrollProgress * PANEL_COUNT));
          if (targetPanel !== activePanelRef.current) {
            setActivePanel(targetPanel);
            activePanelRef.current = targetPanel;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getNavbarHeight, isMobile]);

  // Touch handlers for mobile / tablet horizontal swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isLockedRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    // Horizontal swipe threshold: 40px (predominantly horizontal so vertical page scroll is unaffected)
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        // Swiping LEFT -> next panel
        goToPanel((activePanelRef.current + 1) % PANEL_COUNT, false);
      } else if (deltaX > 0) {
        // Swiping RIGHT -> previous panel
        goToPanel((activePanelRef.current - 1 + PANEL_COUNT) % PANEL_COUNT, false);
      }
    }
  };

  return (
    // OUTER WRAPPER:
    // On desktop: tall enough for sticky scroll snapping.
    // On mobile: normal natural height (no snap scroll, no pinning!).
    <div
      id="overview"
      ref={outerRef}
      style={{
        height: isMobile ? 'auto' : `calc((100vh - 56px) * ${PANEL_COUNT + 1})`,
      }}
      className="relative scroll-mt-[56px] bg-[#07172E] w-full min-h-[calc(100dvh-56px)] lg:min-h-0"
    >
      {/* INNER: Sticky on desktop below navbar, relative (completely unpinned) on mobile */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: isMobile ? 'relative' : 'sticky',
          top: isMobile ? '0' : '56px',
          height: isMobile ? 'auto' : 'calc(100vh - 56px)',
        }}
        className="w-full relative lg:sticky lg:top-[56px] min-h-[calc(100dvh-56px)] lg:min-h-[500px] lg:h-[calc(100vh-56px)] max-h-none lg:max-h-[1080px] overflow-hidden select-none border-t border-b border-[#C8B89A]/30 flex flex-col justify-center"
      >
        {/* ========================================================================= */}
        {/* Top Sub-Nav Ribbon: "COLLEGE", "DEPARTMENT", "IEEE CHAPTER" */}
        {/* ========================================================================= */}
        <div className="absolute top-0 left-0 w-full z-30 px-3 sm:px-8 pt-8 sm:pt-9 md:pt-10 pb-2.5 sm:pb-3 flex items-center justify-center bg-[#07172E]/95 md:backdrop-blur-md border-b border-[#C8B89A]/30 shadow-md">
          <div className="flex items-center space-x-4 sm:space-x-12 md:space-x-16 font-sans text-[11px] sm:text-sm">
            {[
              { title: 'COLLEGE', idx: 0 },
              { title: 'DEPARTMENT', idx: 1 },
              { title: 'IEEE CHAPTER', idx: 2 },
            ].map((tab) => (
              <button
                key={tab.idx}
                onClick={() => goToPanel(tab.idx, false)}
                className={`transition-all duration-200 cursor-pointer pb-0.5 sm:pb-1 border-b-2 font-medium tracking-wide ${activePanel === tab.idx
                  ? 'border-[#D4AF37] text-white font-bold'
                  : 'border-transparent text-white/60 hover:text-white/90 hover:border-white/30'
                  }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Mobile Slide Navigation Buttons */}
        {/* ========================================================================= */}
        {isMobile && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-12 z-40 lg:hidden pointer-events-none">
            <button
              onClick={() => goToPanel((activePanelRef.current - 1 + PANEL_COUNT) % PANEL_COUNT, false)}
              className="pointer-events-auto bg-[#07172E]/90 text-[#D4AF37] p-2.5 rounded-full md:backdrop-blur-md border border-[#C8B89A]/40 hover:bg-[#07172E] transition-colors shadow-2xl"
              aria-label="Previous panel"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goToPanel((activePanelRef.current + 1) % PANEL_COUNT, false)}
              className="pointer-events-auto bg-[#07172E]/90 text-[#D4AF37] p-2.5 rounded-full md:backdrop-blur-md border border-[#C8B89A]/40 hover:bg-[#07172E] transition-colors shadow-2xl"
              aria-label="Next panel"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Horizontal Track: 300vw wide, snaps using CSS transform */}
        {/* ========================================================================= */}
        <div
          className="flex h-full w-[300vw] will-change-transform"
          style={{
            transform: `translateX(-${activePanel * 100}vw)`,
            transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          {/* ========================================================================= */}
          {/* PANEL 0: OUR COLLEGE (Deep Midnight Navy with Gold & Cream) */}
          {/* ========================================================================= */}
          <div
            className="w-screen h-full flex-shrink-0 flex items-center justify-center text-white px-4 sm:px-8 lg:px-12 xl:px-16 pt-14 lg:pt-16 pb-8 lg:pb-10 relative overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: "url('/backgrounds/bg-blue-n.jpg')",
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
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/40 via-transparent to-black/30 z-0" />

            {/* Archival Monogram Watermark */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[14vw] font-serif font-black text-white/[0.02] select-none pointer-events-none tracking-tighter leading-none">
              SLRTCE
            </div>

            {/* Content Layout */}
            <div className="max-w-[1360px] xl:max-w-[1480px] 2xl:max-w-[1560px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8 xl:gap-10 relative z-10 max-h-[calc(100vh-115px)] overflow-x-hidden overflow-y-auto lg:overflow-visible py-1 px-1 sm:px-0 pb-12 sm:pb-6 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {/* Left Column: Actual College Photo with Vintage Archival Treatment */}
              <div className="w-full lg:w-[38%] xl:w-[40%] flex justify-center lg:justify-start relative shrink-0">

                {/* Photo Container - Well-balanced Square */}
                <div className="relative w-56 xs:w-64 sm:w-68 md:w-76 lg:w-[300px] xl:w-[350px] 2xl:w-[390px] aspect-square shrink-0">
                  {/* Subtle drop shadow for depth */}
                  <div className="absolute inset-2 bg-black/30 blur-2xl z-0 rounded-sm"></div>

                  {/* Archival Torn Paper Background Frame - Square */}
                  <div className="relative z-10 w-full h-full aspect-square bg-[#E8DCC8] p-2 sm:p-4 lg:p-5 shadow-2xl rotate-[2deg] transition-transform duration-700 hover:rotate-[1deg] flex flex-col"
                    style={{
                      clipPath: 'polygon(1% 2%, 10% 0%, 20% 2%, 30% 0%, 40% 1%, 50% 0%, 60% 2%, 70% 0%, 80% 1%, 90% 0%, 98% 1%, 100% 10%, 99% 20%, 100% 30%, 98% 40%, 100% 50%, 99% 60%, 100% 70%, 98% 80%, 100% 90%, 99% 98%, 90% 100%, 80% 98%, 70% 100%, 60% 99%, 50% 100%, 40% 98%, 30% 100%, 20% 99%, 10% 100%, 1% 98%, 0% 90%, 1% 80%, 0% 70%, 2% 60%, 0% 50%, 1% 40%, 0% 30%, 2% 20%, 0% 10%)'
                    }}>

                    {/* The Actual Photo - Square */}
                    <div className="relative w-full h-full aspect-square overflow-hidden border border-[#C8B89A]/50 rotate-[-1deg] bg-slate-900">
                      <img
                        src="/slrtce-actual-photo.webp"
                        alt="Shree L. R. Tiwari College of Engineering"
                        className="w-full h-full object-cover filter contrast-[1.05] saturate-[0.9] sepia-[0.05]"
                      />
                      {/* Vintage Color Wash Overlay */}
                      <div className="absolute inset-0 bg-amber-900/10 pointer-events-none mix-blend-multiply"></div>
                    </div>

                    {/* Tape 1 - Top Center */}
                    <div className="absolute -top-2 sm:-top-3.5 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-4 sm:h-8 bg-[#D4C9A8]/85 shadow-sm z-20 opacity-90 md:backdrop-blur-sm" style={{ clipPath: 'polygon(2% 0, 98% 0, 100% 100%, 0 100%)' }}></div>

                    {/* Tape 2 - Bottom Left */}
                    <div className="absolute -bottom-2 sm:-bottom-4 -left-1 sm:-left-2 w-14 sm:w-20 h-3.5 sm:h-7 bg-[#D4C9A8]/85 rotate-[25deg] shadow-sm z-20 opacity-90 md:backdrop-blur-sm" style={{ clipPath: 'polygon(0 0, 100% 5%, 95% 100%, 5% 95%)' }}></div>
                  </div>

                  {/* Torn-Paper Label: SLRTCE */}
                  <div className="absolute -bottom-2.5 sm:-bottom-5 right-2 sm:right-4 z-30 bg-[#F4EFE6] text-[#0A2A5E] px-2.5 sm:px-4 py-0.5 sm:py-1.5 shadow-lg border border-[#C8B89A]/60 rotate-[-4deg]"
                    style={{ clipPath: 'polygon(0% 5%, 95% 0%, 100% 95%, 5% 100%)' }}>
                    <span className="font-display font-extrabold text-xs sm:text-lg tracking-widest uppercase">
                      SLRTCE
                    </span>
                  </div>

                  {/* Optional Subtle Postal Details */}
                  <div className="absolute -top-2 -left-4 z-20 text-[0.55rem] font-mono text-[#D4AF37]/80 tracking-widest rotate-[-15deg] hidden sm:block">
                    No. 2010-ENG-MH
                  </div>
                </div>

              </div>

              {/* Right Column: Wide Landscape Postal Ticket with Top-Right ESTB 2010 Stamp */}
              <div className="w-full lg:w-[62%] xl:w-[60%] flex justify-center lg:justify-end relative px-2 sm:px-0">
                <div className="relative w-full max-w-[700px] xl:max-w-[800px] 2xl:max-w-[880px] rotate-0 sm:rotate-[1deg] lg:rotate-[1deg] transition-transform duration-500">

                  {/* Concentric Perforated Stamp Borders - Visible on all devices */}
                  <div>
                    <PerforatedGhostOutline
                      insetClass="-inset-2 sm:-inset-5"
                      opacityClass="opacity-40"
                      idPrefix="ghost-inner"
                    />
                    <PerforatedGhostOutline
                      insetClass="-inset-3.5 sm:-inset-10"
                      opacityClass="opacity-20"
                      idPrefix="ghost-outer"
                    />
                  </div>

                  {/* Floating Circular ESTB 2010 Stamp at Top Right Corner */}
                  <div className="absolute top-1 sm:-top-5 lg:-top-7 right-1 sm:-right-4 lg:-right-5 z-30 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 sm:w-24 sm:h-24 rounded-full bg-[#B71C1C] text-white flex flex-col items-center justify-center shadow-2xl border-2 border-white/90 rotate-[-5deg] hover:rotate-0 transition-transform duration-300 pointer-events-auto">
                      <div className="w-[calc(100%-4px)] h-[calc(100%-4px)] sm:w-[calc(100%-8px)] sm:h-[calc(100%-8px)] rounded-full border border-dashed border-white/70 flex flex-col items-center justify-center p-0.5 sm:p-1">
                        <span className="text-[0.4rem] sm:text-[0.65rem] font-serif tracking-widest uppercase font-bold text-white/90 leading-tight">
                          ESTB.
                        </span>
                        <span className="text-xs sm:text-2xl font-serif font-black tracking-tight leading-none text-white my-0.5">
                          2010
                        </span>
                        <span className="text-[0.45rem] sm:text-[0.65rem] text-amber-200 leading-none">★</span>
                      </div>
                    </div>
                  </div>

                  {/* Rectangle Postal Ticket Container (Stamp Card) */}
                  <div className="stamp-card w-full bg-[#F5F0E6] text-[#1A4338] relative z-10 px-3 sm:px-7 lg:px-9 py-2.5 sm:py-5 lg:py-6 shadow-2xl rounded-xl sm:rounded-2xl">

                    {/* Ticket Texture Overlay */}
                    <div className="absolute inset-0 bg-[url('/backgrounds/paper-texture-clean.webp')] opacity-25 mix-blend-multiply pointer-events-none z-0 rounded-2xl"></div>

                    {/* Main Content Layout (Vertical Stack of Horizontal Rows) */}
                    <div className="relative z-10 flex flex-col justify-between pl-0 sm:pl-4 pr-3 sm:pr-8">

                      {/* Far-left dashed stub perforation line */}
                      <div className="hidden sm:block absolute -left-1.5 top-0 bottom-0 border-l border-dashed border-[#C8B89A]/80 pointer-events-none"></div>

                      {/* 1. Title */}
                      <div className="flex flex-wrap items-baseline gap-1 sm:gap-2.5 pr-10 sm:pr-0">
                        <h2 className="font-serif font-black text-xs min-[380px]:text-sm sm:text-[1.3rem] lg:text-[1.65rem] text-[#1A4338] leading-tight tracking-tight">
                          Shree L. R. Tiwari College of Engineering
                        </h2>
                        <span className="font-serif font-bold text-[11px] sm:text-lg text-[#1A4338]/85">
                          (SLRTCE)
                        </span>
                      </div>

                      {/* 2. College Info Paragraph */}
                      <p className="font-sans text-[#3D4D44] text-[0.66rem] min-[380px]:text-[0.72rem] sm:text-[0.86rem] leading-snug sm:leading-relaxed text-justify mt-1 sm:mt-2.5">
                        Shree L. R. Tiwari College of Engineering (SLRTCE), established in 2010, is an autonomous engineering institute affiliated with the University of Mumbai and the first engineering college in the Mira-Bhayandar region. The institute is committed to providing quality technical education while fostering research, innovation, entrepreneurship, industry interaction, and holistic student development.
                      </p>
                      <p className="font-sans text-[#3D4D44] text-[0.66rem] min-[380px]:text-[0.72rem] sm:text-[0.86rem] leading-snug sm:leading-relaxed text-justify mt-1 sm:mt-2.5">
                        With a strong focus on emerging technologies, experiential learning, research and interdisciplinary collaboration, SLRTCE provides students with opportunities to transform academic knowledge into practical solutions. The institute encourages participation in research projects, hackathons, technical competitions, industry internships, conferences and innovation initiatives.
                      </p>

                      {/* Horizontal Separator Line */}
                      <div className="w-full border-b border-[#C8B89A]/80 my-1.5 sm:my-3"></div>

                      {/* 3. The Three Points in a HORIZONTAL Row Below Paragraph */}
                      <div className="grid grid-cols-3 gap-1 sm:gap-4 w-full">

                        {/* Point 1: Autonomous */}
                        <div className="flex items-center gap-1 sm:gap-2.5">
                          <svg className="w-4 h-4 sm:w-7 sm:h-7 text-[#1A4338] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6" />
                          </svg>
                          <div className="border-l border-[#C8B89A]/80 pl-1 sm:pl-2.5">
                            <span className="font-sans font-bold text-[0.5rem] min-[380px]:text-[0.58rem] sm:text-[0.72rem] text-[#1A4338] uppercase tracking-wider leading-tight block">
                              AUTONOMOUS <br />
                              COLLEGE
                            </span>
                          </div>
                        </div>

                        {/* Point 2: Affiliated */}
                        <div className="flex items-center gap-1 sm:gap-2.5">
                          <svg className="w-4 h-4 sm:w-7 sm:h-7 text-[#1A4338] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="border-l border-[#C8B89A]/80 pl-1 sm:pl-2.5">
                            <span className="font-sans font-bold text-[0.5rem] min-[380px]:text-[0.58rem] sm:text-[0.72rem] text-[#1A4338] uppercase tracking-wider leading-tight block">
                              AFFILIATED WITH <br />
                              MUMBAI UNIV.
                            </span>
                          </div>
                        </div>

                        {/* Point 3: Accredited */}
                        <div className="flex items-center gap-1 sm:gap-2.5">
                          <svg className="w-4 h-4 sm:w-7 sm:h-7 text-[#1A4338] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="9" r="6" />
                            <path d="M9 14.5L7 21l5-2.5L17 21l-2-6.5" />
                            <path d="M12 7l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.3z" fill="currentColor" />
                          </svg>
                          <div className="border-l border-[#C8B89A]/80 pl-1 sm:pl-2.5">
                            <span className="font-sans font-bold text-[0.5rem] min-[380px]:text-[0.58rem] sm:text-[0.72rem] text-[#1A4338] uppercase tracking-wider leading-tight block">
                              AICTE &amp; NAAC <br />
                              ACCREDITED
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* PANEL 1: OUR BRANCH (Deep Forest Teal/Emerald with Archival Monograph) */}
          {/* ========================================================================= */}
          <div
            className="w-screen h-full flex-shrink-0 flex items-center justify-center text-white px-4 sm:px-8 lg:px-12 xl:px-16 pt-14 lg:pt-16 pb-8 lg:pb-10 relative overflow-hidden bg-[#062321]"
          >
            {/* Rich High-Fidelity Background */}
            <div
              className="absolute inset-0 bg-cover bg-center contrast-[1.08] saturate-[1.18] brightness-[0.98]"
              style={{
                backgroundImage: "url('/backgrounds/bg-teal-n.jpg')",
              }}
            />
            {/* Subtle Tonal Depth Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#021816]/30 via-transparent to-[#021816]/40 z-0" />
            {/* Tactile Fine Grain Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 z-0"
              style={{
                backgroundImage: "url('/backgrounds/noise-texture.svg')",
                backgroundRepeat: 'repeat',
              }}
            />
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/45 via-transparent to-black/35 z-0" />

            {/* Archival Watermark */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[14vw] font-serif font-black text-white/[0.02] select-none pointer-events-none tracking-tighter leading-none">
              ENGINEER
            </div>

            {/* Content Layout */}
            <div className="max-w-[1360px] xl:max-w-[1480px] 2xl:max-w-[1560px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8 xl:gap-10 relative z-10 max-h-[calc(100vh-115px)] overflow-x-hidden overflow-y-auto lg:overflow-visible py-1 px-1 sm:px-0 pb-12 sm:pb-6 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {/* Left Column: Stylized Computer Engineering Artwork Sticker */}
              <div className="w-full lg:w-[38%] xl:w-[40%] flex justify-center lg:justify-start relative shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative flex items-center justify-center select-none rotate-[-4deg] lg:rotate-[-4deg]"
                >
                  {/* Subtle Ambient Backlight Glow */}
                  <div className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-gradient-to-r from-yellow-500/20 via-red-500/20 to-cyan-400/20 blur-xl sm:blur-2xl opacity-70 pointer-events-none" />

                  <img
                    src="/CompEng-sticker.webp"
                    alt="Department of Computer Engineering"
                    width="1024"
                    height="1007"
                    className="relative z-10 w-56 xs:w-64 sm:w-72 md:w-80 lg:w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] lg:max-w-[420px] xl:max-w-[480px] h-auto max-h-[26vh] sm:max-h-[34vh] lg:max-h-[46vh] object-contain md:drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] pointer-events-none"
                  />
                </motion.div>
              </div>

              {/* Right Column: Wide Landscape Postal Ticket for Computer Engineering Department */}
              <div className="w-full lg:w-[62%] xl:w-[60%] flex justify-center lg:justify-end relative px-2 sm:px-0">
                <div className="relative w-full max-w-[700px] xl:max-w-[800px] 2xl:max-w-[880px] rotate-0 sm:rotate-[1deg] lg:rotate-[1deg] transition-transform duration-500">

                  {/* Concentric Perforated Stamp Borders - Visible on all devices */}
                  <div>
                    <PerforatedGhostOutline
                      insetClass="-inset-2 sm:-inset-5"
                      opacityClass="opacity-40"
                      idPrefix="dept-ghost-inner"
                    />
                    <PerforatedGhostOutline
                      insetClass="-inset-3.5 sm:-inset-10"
                      opacityClass="opacity-20"
                      idPrefix="dept-ghost-outer"
                    />
                  </div>

                  {/* Floating Circular NBA ACCREDITED Stamp at Top Right Corner (Matching College ESTB Stamp) */}
                  <div className="absolute top-1 sm:-top-5 lg:-top-7 right-1 sm:-right-4 lg:-right-5 z-30 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 sm:w-24 sm:h-24 rounded-full bg-[#B71C1C] text-white flex flex-col items-center justify-center shadow-2xl border-2 border-white/90 rotate-[-8deg] hover:rotate-0 transition-transform duration-300 pointer-events-auto">
                      <div className="w-[calc(100%-4px)] h-[calc(100%-4px)] sm:w-[calc(100%-8px)] sm:h-[calc(100%-8px)] rounded-full border border-dashed border-white/70 flex flex-col items-center justify-center p-0.5 sm:p-1 text-center">

                        <span className="text-xs sm:text-2xl font-serif font-black tracking-tight leading-none text-white my-0.5">
                          NBA
                        </span>
                        <span className="text-[0.32rem] sm:text-[0.54rem] font-serif font-bold tracking-tight text-white/90 leading-tight">
                          ACCREDITED
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Box-Shaped Rectangle Postal Ticket Container (Stamp Card) */}
                  <div className="stamp-card w-full bg-[#F5F0E6] text-[#1A4338] relative z-10 px-3 sm:px-7 lg:px-9 py-2.5 sm:py-5 lg:py-6 shadow-2xl rounded-xl sm:rounded-2xl">

                    {/* Ticket Texture Overlay */}
                    <div className="absolute inset-0 bg-[url('/backgrounds/paper-texture-clean.webp')] opacity-25 mix-blend-multiply pointer-events-none z-0 rounded-2xl"></div>

                    {/* Main Content Layout */}
                    <div className="relative z-10 flex flex-col justify-between pl-0 sm:pl-4 pr-3 sm:pr-8">

                      {/* Far-left dashed stub perforation line */}
                      <div className="hidden sm:block absolute -left-1.5 top-0 bottom-0 border-l border-dashed border-[#C8B89A]/80 pointer-events-none"></div>

                      {/* Top Header Ribbon */}
                      <div className="flex items-center justify-between border-b border-[#C8B89A]/50 pb-1 sm:pb-2">
                        <span className="font-mono text-[0.5rem] sm:text-[0.7rem] uppercase tracking-wider sm:tracking-widest text-[#1A4338]/80 font-bold truncate pr-1">
                          ✦ DEPARTMENT OF COMPUTER ENGINEERING · SLRTCE
                        </span>
                      </div>

                      {/* 1. Title & Tagline */}
                      <div className="mt-1 sm:mt-2">
                        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2.5 pr-10 sm:pr-0">
                          <h2 className="font-serif font-black text-xs min-[380px]:text-sm sm:text-[1.3rem] lg:text-[1.65rem] text-[#1A4338] leading-tight tracking-tight">
                            Department of Computer Engineering
                          </h2>
                        </div>

                      </div>

                      {/* 2. Department Info Paragraph */}
                      <p className="font-sans text-[#3D4D44] text-[0.66rem] min-[380px]:text-[0.72rem] sm:text-[0.86rem] leading-snug sm:leading-relaxed text-justify mt-1 sm:mt-2">
                        The Department of Computer Engineering at Shree L. R. Tiwari College of Engineering was established in 2010 with a vision of developing skilled professionals equipped to meet the evolving demands of the software and hardware industry. The department offers undergraduate and postgraduate programmes that build strong foundations in computing, engineering principles, technology and problem-solving.
                      </p>
                      <p className="font-sans text-[#3D4D44] text-[0.66rem] min-[380px]:text-[0.72rem] sm:text-[0.86rem] leading-snug sm:leading-relaxed text-justify mt-1 sm:mt-2">
                        The department places emphasis on quality education, practical learning, research and skill development. Students are encouraged to explore emerging technologies, participate in technical activities, develop innovative solutions and bridge the gap between academic knowledge and real-world applications. The department also promotes research culture and provides opportunities for students to pursue higher studies and professional careers.
                      </p>

                      {/* Horizontal Separator Line */}
                      <div className="w-full border-b border-[#C8B89A]/80 my-1.5 sm:my-3"></div>

                      {/* 3. The Three Points in a Row Below Paragraph */}
                      <div className="grid grid-cols-3 gap-1 sm:gap-4 w-full">

                        {/* Point 1: Advanced Labs & AI */}
                        <div className="flex items-center gap-1 sm:gap-2.5">
                          <svg className="w-4 h-4 sm:w-7 sm:h-7 text-[#1A4338] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div className="border-l border-[#C8B89A]/80 pl-1 sm:pl-2.5">
                            <span className="font-sans font-bold text-[0.5rem] min-[380px]:text-[0.58rem] sm:text-[0.72rem] text-[#1A4338] uppercase tracking-wider leading-tight block">
                              AI &amp; ADVANCED <br />
                              RESEARCH LABS
                            </span>
                          </div>
                        </div>

                        {/* Point 2: Industry Tie-ups & Certifications */}
                        <div className="flex items-center gap-1 sm:gap-2.5">
                          <svg className="w-4 h-4 sm:w-7 sm:h-7 text-[#1A4338] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <div className="border-l border-[#C8B89A]/80 pl-1 sm:pl-2.5">
                            <span className="font-sans font-bold text-[0.5rem] min-[380px]:text-[0.58rem] sm:text-[0.72rem] text-[#1A4338] uppercase tracking-wider leading-tight block">
                              INDUSTRY TIE-UPS <br />
                              &amp; PLACEMENTS
                            </span>
                          </div>
                        </div>

                        {/* Point 3: Hackathons & Research */}
                        <div className="flex items-center gap-1 sm:gap-2.5">
                          <svg className="w-4 h-4 sm:w-7 sm:h-7 text-[#1A4338] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="9" r="6" />
                            <path d="M9 14.5L7 21l5-2.5L17 21l-2-6.5" />
                            <path d="M12 7l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.3z" fill="currentColor" />
                          </svg>
                          <div className="border-l border-[#C8B89A]/80 pl-1 sm:pl-2.5">
                            <span className="font-sans font-bold text-[0.5rem] min-[380px]:text-[0.58rem] sm:text-[0.72rem] text-[#1A4338] uppercase tracking-wider leading-tight block">
                              HACKATHONS &amp; <br />
                              INNOVATION
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* PANEL 2: IEEE SLRTCE STUDENT BRANCH (Deep Indigo/Violet with Philatelic Seal) */}
          {/* ========================================================================= */}
          <div
            className="w-screen h-full flex-shrink-0 flex items-center justify-center text-white px-4 sm:px-8 lg:px-12 xl:px-16 pt-14 lg:pt-16 pb-8 lg:pb-10 relative overflow-hidden bg-[#160d2b]"
          >
            {/* Rich High-Fidelity Background */}
            <div
              className="absolute inset-0 bg-cover bg-center contrast-[1.08] saturate-[1.18] brightness-[0.98]"
              style={{
                backgroundImage: "url('/backgrounds/bg-purple-n.jpg')",
              }}
            />
            {/* Subtle Tonal Depth Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1b0a33]/30 via-transparent to-[#100520]/40 z-0" />
            {/* Tactile Fine Grain Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 z-0"
              style={{
                backgroundImage: "url('/backgrounds/noise-texture.svg')",
                backgroundRepeat: 'repeat',
              }}
            />
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/45 via-transparent to-black/35 z-0" />

            {/* Archival Watermark */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[14vw] font-serif font-black text-white/[0.02] select-none pointer-events-none tracking-tighter leading-none">
              IEEE
            </div>

            {/* Content Layout */}
            <div className="max-w-[1360px] xl:max-w-[1480px] w-full mx-auto grid grid-cols-12 gap-3 sm:gap-6 lg:gap-8 xl:gap-12 items-center relative z-10 max-h-[calc(100vh-115px)] overflow-x-hidden overflow-y-auto lg:overflow-visible py-1 px-1 sm:px-0 pb-12 sm:pb-6 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* Left Column: Gazette Information */}
              <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
                {/* Postal Tag */}
                <div className="flex items-center gap-2 mb-1 sm:mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-[#FCF9F2] text-[#0A2A5E] font-mono text-[0.55rem] sm:text-[0.68rem] tracking-wider uppercase font-bold border border-[#C8B89A] shadow-xs">
                    ✦ IEEE SLRTCE
                  </span>
                  <span className="h-px w-6 bg-[#C8B89A]/40 hidden sm:inline-block" />
                  <span className="text-amber-200/80 text-[0.58rem] sm:text-[0.72rem] font-serif uppercase tracking-wider">
                    Global Technical Consortium
                  </span>
                </div>

                {/* Editorial Heading */}
                <h2 className="text-lg min-[380px]:text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-white tracking-tight leading-tight mb-1 sm:mb-2.5">
                  IEEE SLRTCE <br />
                  <span className="text-amber-300 font-display italic font-semibold">
                    Student Branch
                  </span>
                </h2>

                {/* Narrative Text */}
                <p className="text-[0.66rem] min-[380px]:text-[0.72rem] sm:text-sm lg:text-[0.95rem] text-[#F4EFE6]/90 leading-snug sm:leading-relaxed mb-2 sm:mb-5 font-light max-w-2xl text-justify sm:text-left">
                  IEEE SLRTCE is the official IEEE Student Branch of Shree L. R. Tiwari College of Engineering (SLRTCE), established in 2026 with a vision to foster technical excellence, innovation, leadership, and professional growth among engineering students. As a part of the global IEEE community, the branch provides students with opportunities to learn, collaborate, innovate, and engage with emerging technologies while connecting academic learning with real-world applications.
                </p>

                {/* Archival Register (3 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-5 pt-1.5 sm:pt-3.5 border-t border-[#C8B89A]/30">
                  <div className="border-l-2 border-amber-400/60 pl-2 sm:pl-3">
                    <div className="text-[0.55rem] sm:text-[0.7rem] font-mono text-amber-300 uppercase tracking-widest mb-0.5">STUDENT COMMUNITY</div>
                    <div className="text-[10px] sm:text-sm font-semibold text-white font-serif">IEEE SLRTCE Community</div>
                    <div className="text-[0.6rem] sm:text-[0.7rem] text-[#DDD5C7] mt-0.5 leading-snug">Bringing together passionate students to learn, innovate &amp; collaborate</div>
                  </div>
                  <div className="border-l-2 border-amber-400/60 pl-2 sm:pl-3">
                    <div className="text-[0.55rem] sm:text-[0.7rem] font-mono text-amber-300 uppercase tracking-widest mb-0.5">TECHNICAL EXCELLENCE</div>
                    <div className="text-[10px] sm:text-sm font-semibold text-white font-serif">Innovation &amp; Knowledge</div>
                    <div className="text-[0.6rem] sm:text-[0.7rem] text-[#DDD5C7] mt-0.5 leading-snug">Workshops, hackathons, research &amp; expert sessions building skills</div>
                  </div>
                  <div className="border-l-2 border-amber-400/60 pl-2 sm:pl-3">
                    <div className="text-[0.55rem] sm:text-[0.7rem] font-mono text-amber-300 uppercase tracking-widest mb-0.5">SLRTCE STUDENT BRANCH</div>
                    <div className="text-[10px] sm:text-sm font-semibold text-white font-serif">Campus Innovation Hub</div>
                    <div className="text-[0.6rem] sm:text-[0.7rem] text-[#DDD5C7] mt-0.5 leading-snug">Technical events, conferences, paper presentations &amp; professional activities</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Commemorative Philatelic Stamp Card */}
              <div className="col-span-12 lg:col-span-5 flex justify-center mt-1 sm:mt-2 lg:mt-0 shrink-0">
                <div className="relative w-full max-w-[190px] xs:max-w-[220px] sm:max-w-[360px] lg:max-w-[420px]">
                  {/* Stamp Card */}
                  <div className="stamp-card !p-2 sm:!p-3.5 bg-[#FCF9F2] text-[#0A2A5E] shadow-2xl rotate-[-1.5deg] transition-transform duration-500 hover:rotate-0">
                    {/* Top Perforation Header */}
                    <div className="flex items-center justify-between border-b border-[#C8B89A]/40 pb-0.5 sm:pb-1 mb-1 px-1 text-[0.52rem] sm:text-[0.65rem] font-mono font-bold tracking-widest text-[#0A2A5E]/80">
                      <span>IEEE SLRTCE</span>
                      <span className="text-[#D4AF37]">IEEE EST. 2026</span>
                      <span>MAHARASHTRA</span>
                    </div>

                    {/* Stamp Center Medallion: Filled completely with IEEE Logo */}
                    <div className="relative bg-[#0A2A5E] text-white p-2.5 sm:p-6 rounded-xs border border-[#C8B89A] flex items-center justify-center overflow-hidden w-full h-[120px] xs:h-[140px] sm:h-[270px] lg:h-[290px] group">
                      {/* Radiant rays background */}
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent pointer-events-none" />

                      {/* Archival dashed inner border */}
                      <div className="absolute inset-1 border border-dashed border-[#C8B89A]/50 rounded-xs pointer-events-none z-10" />

                      {/* IEEE Logo filling the whole part */}
                      <div className="relative w-full h-full flex items-center justify-center z-10">
                        {/* Soft ambient white backing for crystal clear contrast and legibility */}
                        <div className="absolute w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-white/90 blur-xl opacity-65 pointer-events-none" />

                        <img
                          src="/LOGO-IEEE.webp"
                          alt="IEEE SLRTCE Student Branch Logo"
                          className="relative z-10 w-full h-full max-h-[105px] xs:max-h-[125px] sm:max-h-[235px] lg:max-h-[250px] object-contain md:drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] select-none transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Stamp Footer Label */}
                    <div className="pt-1 sm:pt-2 px-1 flex items-center justify-between text-[#0A2A5E]">
                      <div className="flex flex-col">
                        <span className="font-serif font-bold text-[10px] sm:text-xs tracking-wide">STUDENT BRANCH CHARTER</span>
                        <span className="text-[0.5rem] sm:text-[0.65rem] text-[#5A5A7A] font-sans">Maharashtra Section</span>
                      </div>
                      <span className="text-[0.5rem] sm:text-[0.62rem] font-mono text-[#D4AF37] font-bold border border-[#D4AF37]/50 px-1 py-0.5 rounded-[2px] bg-amber-50">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Bottom Archival Status Bar */}
        {/* ========================================================================= */}
        <div className="absolute bottom-0 left-0 w-full z-30 px-4 sm:px-8 lg:px-16 py-2.5 bg-[#07172E]/92 md:backdrop-blur-md border-t border-[#C8B89A]/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-[0.68rem] sm:text-xs font-mono text-[#FBF7EE]/80">
              [ 0{activePanel + 1} OF 03 ]
            </span>
            <div className="flex space-x-1.5">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => goToPanel(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activePanel === idx
                    ? 'w-7 bg-[#D4AF37]'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                    }`}
                  aria-label={`Jump to folio ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[0.65rem] sm:text-[0.72rem] font-mono text-amber-200/80">
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationScrollSection;