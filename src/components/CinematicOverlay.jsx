import React from 'react';

/**
 * CinematicOverlay — Clean premium visual layer.
 * 
 * Provides:
 * - Vignette (dark edges for depth)
 * - Anamorphic lens flare (subtle gold streak)
 * - Scene counter (Roman numerals, bottom-left)
 * - Section dots (clickable navigation, right side)
 */
export default function CinematicOverlay({ currentAct = 1, totalActs = 4, onNavigate }) {
  const romanNumerals = ['I', 'II', 'III', 'IV'];
  const sectionIds = ['section-hero', 'section-manifesto', 'section-porsche', 'section-collection'];

  const handleDotClick = (index) => {
    if (onNavigate) {
      onNavigate(index);
    } else {
      const el = document.querySelector(`.${sectionIds[index]}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cinematic-overlay fixed inset-0 pointer-events-none z-[200]" aria-hidden="true">

      {/* Vignette — subtle dark edges */}
      <div className="vignette" />

      {/* Anamorphic Lens Flare — very subtle */}
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
