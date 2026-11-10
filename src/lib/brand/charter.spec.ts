import { readFileSync } from 'node:fs';

import { CHARTER } from './charter';

const css = readFileSync('src/app/globals.css', 'utf8');
const icon = readFileSync('src/app/icon.svg', 'utf8');

function token(name: string, scope: string): string {
  const block = css.slice(css.indexOf(`${scope} {`));
  const found = new RegExp(`${name}:\\s*(#[0-9a-f]{6})`).exec(block);

  return found ? found[1] : '';
}

describe('les valeurs de la charte hors du fichier de jetons', () => {
  // the manifest and the favicon carry their own copy, so this is what stops the two from drifting
  it('reprend exactement les jetons de globals.css', () => {
    expect(CHARTER.green).toBe(token('--brand-green', ':root'));
    expect(CHARTER.amber).toBe(token('--brand-amber', ':root'));
    expect(CHARTER.ivory).toBe(token('--brand-ivory', ':root'));
    expect(CHARTER.night).toBe(token('--background', '.dark'));
    expect(CHARTER.espresso).toBe(token('--foreground', ':root'));
    expect(CHARTER.laterite).toBe(token('--itinerary', ':root'));
    expect(CHARTER.sable).toBe(token('--secondary', ':root'));
    expect(CHARTER.muted).toBe(token('--muted-foreground', ':root'));
  });

  it('est la couleur que dessine la marque du favicon', () => {
    expect(icon).toContain(CHARTER.green);
    expect(icon).toContain(CHARTER.ivory);
  });
});
