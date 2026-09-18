"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const AUDIO_STORAGE_KEY = "parcelpulse_audio_muted";

export function useHapticAudio() {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load user mute preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(AUDIO_STORAGE_KEY);
      if (stored !== null) {
        setIsMuted(stored === "true");
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(AUDIO_STORAGE_KEY, String(next));
      }
      return next;
    });
  }, []);

  // Lazily initialize AudioContext on user interaction
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  /**
   * Laser Barcode Beep: Dual-frequency sine wave sweep (1200Hz -> 1800Hz, 60ms)
   */
  const playLaserBeep = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const now = ctx.currentTime;

      // Frequency glide 1200Hz to 1800Hz
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.06);

      // Volume envelope (quick 60ms attack and release)
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch {
      // Ignore audio synthesis errors on locked browsers
    }
  }, [isMuted, getAudioContext]);

  /**
   * Mechanical Switch Blip: Low square wave blip (120Hz, 30ms, fast exponential decay)
   */
  const playMechanicalClick = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(120, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isMuted, getAudioContext]);

  /**
   * Success chime for batch booking completion
   */
  const playSuccessChime = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.16);
      });
    } catch {
      // Ignore
    }
  }, [isMuted, getAudioContext]);

  return {
    isMuted,
    toggleMute,
    playLaserBeep,
    playMechanicalClick,
    playSuccessChime,
  };
}
