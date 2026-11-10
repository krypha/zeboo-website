// the mark keeps the charter's own colours in both modes, which is why it reads the fixed brand tokens and not the palette
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <rect
        x="4"
        y="4"
        width="112"
        height="112"
        rx="30"
        className="fill-brand-green"
      />
      <path
        d="M46 40 C35 30 26 24 19 22 C25 32 33 40 44 49 Z"
        className="fill-brand-amber"
      />
      <path
        d="M74 40 C85 30 94 24 101 22 C95 32 87 40 76 49 Z"
        className="fill-brand-amber"
      />
      <circle cx="46" cy="64" r="6.4" className="fill-brand-ivory" />
      <circle cx="74" cy="64" r="6.4" className="fill-brand-ivory" />
      <rect
        x="40"
        y="82"
        width="40"
        height="24"
        rx="12"
        className="fill-brand-ivory"
      />
      <circle cx="52" cy="94" r="3.4" className="fill-brand-green" />
      <circle cx="68" cy="94" r="3.4" className="fill-brand-green" />
    </svg>
  );
}
