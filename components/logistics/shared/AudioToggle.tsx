"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";

export const AudioToggle: React.FC = () => {
  const { isMuted, toggleMute, playMechanicalClick } = useHapticAudio();

  const handleToggle = () => {
    playMechanicalClick();
    toggleMute();
  };

  return (
    <button
      onClick={handleToggle}
      title={isMuted ? "Sound Muted (Click to Enable)" : "Sound Enabled (Click to Mute)"}
      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-obsidian-border bg-obsidian-card hover:bg-obsidian-hover active:scale-[0.97] transition-all duration-75 text-xs font-mono text-zinc-300 group"
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
      ) : (
        <Volume2 className="w-4 h-4 text-hazard-amber animate-pulse" />
      )}
      <span className="hidden sm:inline text-[11px] uppercase tracking-wider text-zinc-400">
        {isMuted ? "Audio: Mute" : "Audio: FX"}
      </span>

      {/* Retro 3-dot LED cluster */}
      <div className="flex items-center gap-1 ml-0.5">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            !isMuted ? "bg-hazard-amber shadow-[0_0_6px_#FF9900]" : "bg-zinc-700"
          }`}
        />
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            !isMuted ? "bg-hazard-amber/70" : "bg-zinc-800"
          }`}
        />
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            !isMuted ? "bg-hyper-teal shadow-[0_0_6px_#00F0FF]" : "bg-zinc-800"
          }`}
        />
      </div>
    </button>
  );
};
