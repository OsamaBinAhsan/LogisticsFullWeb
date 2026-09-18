"use client";

import React, { useState } from "react";
import { type ICourierAdapter, type CourierCredentials } from "@/lib/services/couriers/types";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";
import {
  Key,
  Shield,
  CheckCircle2,
  Lock,
  Save,
  Radio,
  Eye,
  EyeOff,
} from "lucide-react";

interface CourierAccountCardProps {
  adapter: ICourierAdapter;
}

export const CourierAccountCard: React.FC<CourierAccountCardProps> = ({ adapter }) => {
  const { playMechanicalClick, playSuccessChime } = useHapticAudio();
  const [creds, setCreds] = useState<CourierCredentials>(adapter.getCredentials());
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    playMechanicalClick();
    adapter.updateCredentials(creds);
    playSuccessChime();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="hardware-panel rounded-xl p-5 border border-obsidian-border space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-obsidian-card border border-obsidian-border flex items-center justify-center font-mono font-bold text-xs uppercase text-hazard-amber">
            {adapter.name.slice(0, 2)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">
              {adapter.displayName}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                Live Webhook Active
              </span>
              <span>•</span>
              <span>Adapter: Pluggable v1.2</span>
            </div>
          </div>
        </div>

        {/* Sandbox vs Production Toggle */}
        <div className="flex items-center gap-1.5 bg-carbon p-1 rounded-md border border-obsidian-border text-[10px] font-mono">
          <button
            onClick={() => {
              playMechanicalClick();
              setCreds((p) => ({ ...p, sandboxMode: false }));
            }}
            className={`px-2 py-0.5 rounded transition-all ${
              !creds.sandboxMode
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Production
          </button>
          <button
            onClick={() => {
              playMechanicalClick();
              setCreds((p) => ({ ...p, sandboxMode: true }));
            }}
            className={`px-2 py-0.5 rounded transition-all ${
              creds.sandboxMode
                ? "bg-hazard-amber/20 text-hazard-amber border border-hazard-amber/40 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Sandbox
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-3 font-mono text-xs">
        <div>
          <label className="block text-zinc-400 text-[10px] uppercase font-semibold mb-1 flex items-center gap-1">
            <Key className="w-3 h-3 text-hazard-amber" />
            API Key / Client ID
          </label>
          <input
            type="text"
            value={creds.apiKey}
            onChange={(e) => setCreds({ ...creds, apiKey: e.target.value })}
            className="w-full bg-carbon border border-obsidian-border rounded px-3 py-1.5 text-white font-mono focus:border-hazard-amber focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-zinc-400 text-[10px] uppercase font-semibold mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-hyper-teal" />
              API Secret / Bearer Token
            </span>
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="text-zinc-500 hover:text-zinc-300 flex items-center gap-0.5 lowercase text-[10px]"
            >
              {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showSecret ? "hide" : "reveal"}
            </button>
          </label>
          <input
            type={showSecret ? "text" : "password"}
            value={creds.secretKey || ""}
            onChange={(e) => setCreds({ ...creds, secretKey: e.target.value })}
            className="w-full bg-carbon border border-obsidian-border rounded px-3 py-1.5 text-white font-mono focus:border-hazard-amber focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-zinc-400 text-[10px] uppercase font-semibold mb-1">
            Merchant Store ID / Branch Hub
          </label>
          <input
            type="text"
            value={creds.storeId || ""}
            onChange={(e) => setCreds({ ...creds, storeId: e.target.value })}
            className="w-full bg-carbon border border-obsidian-border rounded px-3 py-1.5 text-white font-mono focus:border-hazard-amber focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-obsidian-border flex items-center justify-between">
        <div className="text-[10px] font-mono text-zinc-500">
          Last verified: Just now
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded bg-obsidian-card hover:bg-obsidian-hover border border-hazard-amber/40 hover:border-hazard-amber text-zinc-200 hover:text-white font-mono text-xs flex items-center gap-1.5 active:scale-95 transition-all"
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-hazard-amber" />
              <span>Update Credentials</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
