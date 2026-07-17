import React from 'react';

/**
 * CinematicOverlay — IMAX-style visual layer rendered on top of everything.
 * 
 * Provides:
 * - Letterbox bars (2.39:1 cinematic ratio)
 * - Film grain (animated SVG noise)
 * - Vignette (dark edges)
 * - Anamorphic lens flare (horizontal gold streak)
 * - Scene counter (Roman numerals)
 * - Section dots (clickable navigation)
 */
export default function CinematicOverlay({ currentAct = 1, totalActs = 5, onNavigate }) {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V'];
  const sectionIds = ['act-hero', 'act-manifesto', 'act-porsche', 'act-reveal', 'act-collection'];

  const handleDotClick = (index) => {
    if (onNavigate) {
      onNavigate(index);
    } else {
      // Default: scroll to the section
      const el = document.querySelector(`.${sectionIds[index]}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cinematic-overlay fixed inset-0 pointer-events-none z-[200]" aria-hidden="true">
      
      {/* IMAX Letterbox Bars */}
      <div className="imax-bar imax-bar-top" />
      <div className="imax-bar imax-bar-bottom" />

      {/* Film Grain */}
      <div className="film-grain" />

      {/* Vignette */}
      <div className="vignette" />

      {/* Anamorphic Lens Flare */}
      <div className="lens-flare" />

      {/* Scene Counter — bottom left */}
      <div className="scene-counter">
        <span className="scene-counter-label">ACT</span>
        <span className="scene-counter-number">
          {romanNumerals[currentAct - 1] || 'I'}
        </span>
      </div>

      {/* Section Dots — right side (clickable) */}
      <div className="section-dots pointer-events-auto" style={{ pointerEvents: 'auto' }}>
        {Array.from({ length: totalActs }, (_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`section-dot ${i + 1 === currentAct ? 'section-dot-active' : ''} cursor-pointer`}
            aria-label={`Go to section ${i + 1}`}
            style={{ pointerEvents: 'auto' }}
          />
        ))}
      </div>
    </div>
  );
}
