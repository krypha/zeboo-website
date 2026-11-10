// srgb to oklch and back, plus the wcag contrast the dark palette is corrected against, after bjorn ottosson's conversions

interface Oklch {
  l: number;
  c: number;
  h: number;
}

const toLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const fromLinear = (v: number) =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;

function parseHex(hex: string): [number, number, number] {
  const match = /^#?([0-9a-f]{6})/i.exec(hex.trim());
  const n = match ? parseInt(match[1], 16) : 0;

  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function toHex(channels: [number, number, number]): string {
  const pair = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${pair(channels[0])}${pair(channels[1])}${pair(channels[2])}`;
}

export function hexToOklch(hex: string): Oklch {
  const [r, g, b] = parseHex(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  return {
    l: lightness,
    c: Math.hypot(a, bb),
    h: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360,
  };
}

function oklchToRgb({ l: lightness, c, h }: Oklch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

// oklch holds colours sRGB cannot show, so the saturation is let down until one of them lands back inside the gamut
export function oklchToHex(colour: Oklch): string {
  let c = colour.c;

  for (let i = 0; i < 30; i += 1) {
    const rgb = oklchToRgb({ ...colour, c });
    if (rgb.every((v) => v >= -0.001 && v <= 1.001)) return toHex(rgb);
    c *= 0.9;
  }

  return toHex(oklchToRgb({ ...colour, c: 0 }));
}

// a translucent token is never seen on its own, so measuring it against its ink has to flatten it onto whatever lies beneath first
export function flatten(hex: string, over: string): string {
  const alpha = /^#?[0-9a-f]{6}([0-9a-f]{2})$/i.exec(hex.trim());
  if (!alpha) return hex;

  const a = parseInt(alpha[1], 16) / 255;
  const top = parseHex(hex);
  const under = parseHex(over);

  return toHex(
    [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a)) as [
      number,
      number,
      number,
    ],
  );
}

function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map(toLinear);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((p, q) => q - p);

  return (high + 0.05) / (low + 0.05);
}

// walks the lightness a hundredth at a time, away from the background, until the ratio is met: darker on a light ground, lighter on a dark one
export function ensureContrast(
  colour: Oklch,
  background: string,
  target: number,
): string {
  const step = luminance(background) < 0.2 ? 0.01 : -0.01;
  let moved = { ...colour };

  for (
    let i = 0;
    i < 90 && contrast(oklchToHex(moved), background) < target;
    i += 1
  ) {
    moved = { ...moved, l: Math.min(0.99, Math.max(0.05, moved.l + step)) };
  }

  return oklchToHex(moved);
}

// react native reads no `rgb(r g b / a)`, so a translucent token is eight hex digits, which is what every alpha in this file already is
export function withAlpha(hex: string, alpha: number): string {
  const pair = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');

  return `${hex.slice(0, 7)}${pair}`;
}

export function inkOn(background: string, light: string, dark: string): string {
  return contrast(light, background) >= contrast(dark, background)
    ? light
    : dark;
}
