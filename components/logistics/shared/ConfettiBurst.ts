"use client";

import confetti from "canvas-confetti";

/**
 * Fires a vibrant, dopamine particle burst with brand colors (Hazard Amber, Hyper-Teal, Neon Pink)
 */
export function fireBatchConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.85, x: 0.35 },
      colors: ["#FF9900", "#00F0FF", "#FF1493", "#10B981", "#FFFFFF"],
      disableForReducedMotion: true,
    });

    // Right burst
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.85, x: 0.65 },
      colors: ["#FF9900", "#00F0FF", "#FF1493", "#10B981", "#FFFFFF"],
      disableForReducedMotion: true,
    });
  } catch {
    // Fallback gracefully if canvas is unsupported
  }
}
