/**
 * Pure SVG Code 128 (Subset B) Barcode Generator.
 * Zero external dependencies, ultra lightweight, crisp vector lines on 203 & 300 DPI thermal printers.
 */

// Code 128 patterns: array of bar-space widths (6 values each for 0-106, 7 values for stop pattern 106)
const CODE128_PATTERNS: string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", // 50-59
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", // 60-69
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", // 70-79
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", // 80-89
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", // 90-99
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112" // 100-106 (106 is Stop)
];

const START_B = 104;
const STOP = 106;

/**
 * Encodes text using Code 128-B character set and calculates the Modulo 103 checksum
 */
export function encodeCode128B(text: string): number[] {
  const codes: number[] = [START_B];
  let checksum = START_B;

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Code 128 Subset B maps ASCII 32..126 to pattern indices 0..94
    const value = charCode >= 32 && charCode <= 126 ? charCode - 32 : 0;
    codes.push(value);
    checksum += value * (i + 1);
  }

  const checkDigit = checksum % 103;
  codes.push(checkDigit);
  codes.push(STOP);

  return codes;
}

export interface BarcodeOptions {
  width?: number; // module width in px
  height?: number; // total bar height in px
  includeText?: boolean;
  quietZone?: boolean;
  barColor?: string;
  bgColor?: string;
}

/**
 * Generates an SVG path or rect collection representing the Code 128 barcode
 */
export function generateBarcodeSvg(
  text: string,
  options: BarcodeOptions = {}
): {
  svgContent: string;
  totalWidth: number;
  totalHeight: number;
} {
  const {
    width = 2,
    height = 56,
    includeText = true,
    quietZone = true,
    barColor = "#000000",
    bgColor = "transparent",
  } = options;

  const codes = encodeCode128B(text);
  const qZone = quietZone ? 10 * width : 0;

  // Calculate total modules
  let totalModules = 0;
  codes.forEach((code) => {
    const pattern = CODE128_PATTERNS[code] || "111111";
    for (let c = 0; c < pattern.length; c++) {
      totalModules += parseInt(pattern[c], 10);
    }
  });

  const totalWidth = totalModules * width + qZone * 2;
  const textHeight = includeText ? 16 : 0;
  const totalHeight = height + textHeight + 4;

  let currentX = qZone;
  let rects = "";

  codes.forEach((code) => {
    const pattern = CODE128_PATTERNS[code] || "111111";
    let isBar = true;
    for (let c = 0; c < pattern.length; c++) {
      const barWidth = parseInt(pattern[c], 10) * width;
      if (isBar) {
        rects += `<rect x="${currentX}" y="0" width="${barWidth}" height="${height}" fill="${barColor}" />`;
      }
      currentX += barWidth;
      isBar = !isBar;
    }
  });

  const textElement = includeText
    ? `<text x="${totalWidth / 2}" y="${height + 13}" font-family="ui-monospace, monospace" font-size="11" font-weight="600" text-anchor="middle" fill="${barColor}" letter-spacing="1.5">${text}</text>`
    : "";

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}" style="background-color: ${bgColor};">
    ${rects}
    ${textElement}
  </svg>`;

  return { svgContent, totalWidth, totalHeight };
}
