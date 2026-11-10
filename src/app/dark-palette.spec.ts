import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  ensureContrast,
  hexToOklch,
  oklchToHex,
  withAlpha,
} from '@/lib/colour/colour';

// the charter's forest green, the one seed the whole dark palette is walked from
const SEED = '#17694A';
const CLAY = '#C4432A';

const { c: seedChroma, h: HUE } = hexToOklch(SEED);
const CHROMA = Math.max(seedChroma, 0.02);

const tone = (lightness: number, scale: number, ceiling: number) =>
  oklchToHex({ l: lightness, c: Math.min(CHROMA * scale, ceiling), h: HUE });

// the same five calls the mobile makes, in the same order, so a drift on either side fails here
const DERIVED: Record<string, string> = {
  '--background': tone(0.18, 0.3, 0.03),
  '--card': tone(0.215, 0.32, 0.032),
  '--surface-raised': tone(0.237, 0.42, 0.038),
  '--raised-edge': tone(0.36, 0.3, 0.035),
  '--deep': tone(0.36, 0.85, 0.1),
  '--deep-light': tone(0.4, 0.9, 0.12),
  '--foreground': tone(0.965, 0.08, 0.012),
  '--secondary': tone(0.26, 0.32, 0.034),
  '--border': tone(0.29, 0.32, 0.034),
  '--muted': tone(0.26, 0.32, 0.034),
};

async function darkBlock(): Promise<Map<string, string>> {
  const css = await readFile(
    join(process.cwd(), 'src/app/globals.css'),
    'utf8',
  );
  const block = /\.dark \{([^}]*)\}/.exec(css)?.[1] ?? '';
  const values = new Map<string, string>();

  for (const [, name, value] of block.matchAll(/(--[a-z-]+):\s*([^;]+);/g)) {
    values.set(name, value.trim());
  }

  return values;
}

describe('the dark palette', () => {
  // it is derived from the charter's one green and never invented, so what is written in the stylesheet has to be what the derivation produces
  it('is what the derivation produces, token by token', async () => {
    const written = await darkBlock();

    for (const [name, expected] of Object.entries(DERIVED)) {
      expect(`${name}=${written.get(name) ?? 'absent'}`).toBe(
        `${name}=${expected}`,
      );
    }
  });

  // amber means money and clay the itinerary in both modes, so neither hue may be walked
  it('leaves amber and the clay ink where the charter put them', async () => {
    const written = await darkBlock();

    expect(written.get('--accent')).toBe('#efa130');
    // the stylesheet is written in lower case and the derivation answers in upper, which is the same colour
    expect(written.get('--accent-soft')?.toLowerCase()).toBe(
      withAlpha('#EFA130', 0.16).toLowerCase(),
    );
  });

  // a soft ground is the colour at a low alpha, not a second colour somebody picked
  it('builds the soft grounds from their own colour', async () => {
    const written = await darkBlock();

    expect(written.get('--primary-soft')).toBe(
      withAlpha(written.get('--primary') ?? '', 0.14),
    );
  });

  // the green panel is a dark surface in both modes, so the amber on it is walked until it reads rather than left as the charter colour
  it('walks the amber until it reads on the green panel', () => {
    expect(ensureContrast(hexToOklch('#EFA130'), '#17694A', 4.5)).toBe(
      '#fdce96',
    );
    expect(ensureContrast(hexToOklch('#EFA130'), '#004931', 4.5)).toBe(
      '#efa130',
    );
  });

  // the brand mark, the trail, the night veil and a generated cover keep their colour whatever the mode, so the dark block must not carry them at all
  it('leaves the four fixed things out of the dark block', async () => {
    const written = await darkBlock();

    for (const name of [
      '--brand-green',
      '--brand-green-light',
      '--brand-amber',
      '--brand-ivory',
      '--itinerary',
    ]) {
      expect(`${name}=${written.get(name) ?? 'absent'}`).toBe(`${name}=absent`);
    }
  });

  // the light mode's clay reads at only four to one against its own soft ground, so the ink is corrected rather than left as the colour
  it('corrects the clay ink until it is readable on its own ground', () => {
    expect(ensureContrast(hexToOklch(CLAY), '#F7E4DE', 4.5)).toBe('#ba3920');
  });
});
