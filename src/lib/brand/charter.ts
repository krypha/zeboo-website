// the charter values that have to exist outside the token file: a web manifest is read by the operating system, a favicon by the browser and the shared image by satori, and none of the three resolves a css variable; charter.spec.ts reads globals.css and fails if any of them drifts from it
export const CHARTER = {
  green: '#17694a',
  amber: '#efa130',
  ivory: '#fbf7ef',
  night: '#05150e',
  espresso: '#241d17',
  laterite: '#c4432a',
  sable: '#efe7d6',
  muted: '#6b6154',
} as const;
