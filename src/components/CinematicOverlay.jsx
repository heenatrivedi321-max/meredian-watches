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
 * - Color grade filter (shifts per section)
 */
export default function CinematicOverlay({ currentAct = 1, totalActs = 5 }) {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V'];

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

      {/* Section Dots — right side */}
      <div className="section-dots">
        {Array.from({ length: totalActs }, (_, i) => (
          <div
            key={i}
            className={`section-dot ${i + 1 === currentAct ? 'section-dot-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
