"use client";

import React, { useMemo } from "react";
import { generateBarcodeSvg, BarcodeOptions } from "@/lib/utils/barcode";

interface SvgBarcodeProps extends BarcodeOptions {
  value: string;
  className?: string;
}

export const SvgBarcode: React.FC<SvgBarcodeProps> = ({
  value,
  className = "",
  width = 2,
  height = 54,
  includeText = true,
  barColor = "#F1F5F9",
  bgColor = "transparent",
}) => {
  const { svgContent } = useMemo(() => {
    return generateBarcodeSvg(value, {
      width,
      height,
      includeText,
      barColor,
      bgColor,
    });
  }, [value, width, height, includeText, barColor, bgColor]);

  return (
    <div
      className={`inline-block overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
