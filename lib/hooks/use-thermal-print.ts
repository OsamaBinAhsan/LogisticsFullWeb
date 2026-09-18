"use client";

import { useState, useCallback } from "react";

export type LabelSize = "4x6" | "3x2";

export function useThermalPrint() {
  const [selectedSize, setSelectedSize] = useState<LabelSize>("4x6");
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const triggerPrint = useCallback(() => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  }, []);

  return {
    selectedSize,
    setSelectedSize,
    isPrinting,
    triggerPrint,
  };
}
