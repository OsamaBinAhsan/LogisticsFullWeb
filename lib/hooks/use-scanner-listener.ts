"use client";

import { useEffect, useRef, useCallback } from "react";

interface ScannerListenerOptions {
  onScan: (barcode: string) => void;
  minChars?: number;
  maxKeyIntervalMs?: number;
  enabled?: boolean;
}

/**
 * Global keypress listener hook that detects rapid keystrokes terminated with Enter,
 * which is the signature of physical USB/Bluetooth HID barcode scanners.
 */
export function useScannerListener({
  onScan,
  minChars = 3,
  maxKeyIntervalMs = 50,
  enabled = true,
}: ScannerListenerOptions) {
  const bufferRef = useRef<string>("");
  const lastKeyTimeRef = useRef<number>(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore when user is actively typing in a standard input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        // Only ignore if it's not our dedicated scanner input
        if (!target.hasAttribute("data-scanner-input")) {
          return;
        }
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      // Reset buffer if key interval was too long (human typing)
      if (timeDiff > maxKeyIntervalMs && bufferRef.current.length > 0) {
        bufferRef.current = "";
      }

      if (e.key === "Enter") {
        if (bufferRef.current.length >= minChars) {
          e.preventDefault();
          const scannedCode = bufferRef.current.trim();
          bufferRef.current = "";
          onScan(scannedCode);
        }
        bufferRef.current = "";
        return;
      }

      // Buffer single printable characters
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        bufferRef.current += e.key;
      }
    },
    [enabled, minChars, maxKeyIntervalMs, onScan]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * Helper function to programmatically trigger a simulated hardware scan
   */
  const simulateScan = useCallback(
    (code: string) => {
      onScan(code);
    },
    [onScan]
  );

  return { simulateScan };
}
