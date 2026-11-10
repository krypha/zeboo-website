import * as React from 'react';

import { cn } from '@/lib/utils';

const iconPaths = {
  // navigation
  home: (
    <>
      <path d="M4 10.5 12 3.5 20 10.5" />
      <path d="M6 9v11h12V9" />
      <path d="M10 20v-5h4v5" />
    </>
  ),

  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16 20.5 20.5" />
    </>
  ),

  trips: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2.5" />
      <path d="M9 8V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2" />
      <path d="M4 13h16" />
    </>
  ),

  cards: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </>
  ),

  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-6" />
      <path d="M12 20v-10" />
      <path d="M17 20v-8" />
    </>
  ),

  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M4 7.5 12 13 20 7.5" />
    </>
  ),

  route: (
    <>
      <circle cx="6" cy="18" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="6" r="2.2" />
      <path d="M7.6 16.5C11 14 14 9.5 16.4 7.6" strokeDasharray="2 2.5" />
    </>
  ),

  map: (
    <>
      <path d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13l-5.5 2-6-2Z" />
      <path d="M9 4.5v13" />
      <path d="M15 6.5v13" />
    </>
  ),

  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path
        d="M15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5Z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),

  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>
  ),

  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),

  bell: (
    <>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),

  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5a13 13 0 0 1 0 17" />
      <path d="M12 3.5a13 13 0 0 0 0 17" />
    </>
  ),

  logout: (
    <>
      <path d="M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14" />
      <path d="M4.5 12h10" />
      <path d="M8.5 8 4.5 12l4 4" />
    </>
  ),

  shield: (
    <>
      <path d="M12 3.5 19 6v5c0 5-4 7.5-7 9-3-1.5-7-4-7-9V6Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),

  // actions
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),

  back: <path d="M15 5 8 12l7 7" />,

  chevron: <path d="M9 5 16 12l-7 7" />,

  close: (
    <>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </>
  ),

  filter: <path d="M4 6h16l-6 7v5l-4 2v-7Z" />,

  edit: (
    <>
      <path d="M4 20l.8-4L16 4.8a2 2 0 0 1 3 3L7.8 19 4 20Z" />
      <path d="M14 6.5 17.5 10" />
    </>
  ),

  trash: (
    <>
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="M6.5 7l1 13h9l1-13" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),

  download: (
    <>
      <path d="M12 4v11" />
      <path d="M8 11l4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),

  camera: (
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2.5" />
      <path d="M8.5 7.5 10 4.5h4l1.5 3" />
      <circle cx="12" cy="13.6" r="3.3" />
    </>
  ),

  pin: (
    <>
      <path d="M12 21s6.5-6 6.5-11.5A6.5 6.5 0 0 0 5.5 9.5C5.5 15 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </>
  ),

  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M10.8 10.8 20 20" />
      <path d="M15.5 15.5 17.5 13.5" />
      <path d="M18.5 18.5 20.5 16.5" />
    </>
  ),

  check: <path d="M5 12.5 10 17.5 19 7" />,

  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3.5 2" />
    </>
  ),

  // status and illustration
  warning: (
    <>
      <path d="M12 4 21 19H3Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.6" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),

  star: (
    <path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.6 7.1 19l.9-5.4L4.1 9.8l5.4-.8Z" />
  ),

  bulb: (
    <>
      <path d="M9.5 18h5" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.8 10.6c.8.7 1.3 1.5 1.3 2.4h5c0-.9.5-1.7 1.3-2.4A6 6 0 0 0 12 3Z" />
    </>
  ),

  offline: (
    <>
      <path d="M3 3 21 21" />
      <path d="M5 12.5a10 10 0 0 1 4-2.6" />
      <path d="M8.7 15.7a5 5 0 0 1 3-1.4" />
      <circle cx="12" cy="19" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),

  briefcase: (
    <>
      <rect x="3.5" y="8" width="17" height="11" rx="2" />
      <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" />
      <path d="M3.5 13h17" />
    </>
  ),

  // provider categories
  bed: (
    <>
      <path d="M3.5 18v-3a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v3" />
      <path d="M3.5 15V7.5" />
      <path d="M20.5 15v-1" />
      <path d="M7 13v-1.5a1.5 1.5 0 0 1 1.5-1.5h2.5" />
    </>
  ),

  food: (
    <>
      <path d="M7 3v6a2 2 0 0 0 4 0V3" />
      <path d="M9 9v12" />
      <path d="M16 3c-1.5 1-1.5 6 0 7v11" />
    </>
  ),

  car: (
    <>
      <path d="M4 14l1.5-5A2 2 0 0 1 7.4 7.5h9.2A2 2 0 0 1 18.5 9L20 14" />
      <path d="M3.5 14h17v3.5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1Z" />
      <circle cx="7.5" cy="18.6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="18.6" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),

  hike: (
    <>
      <path d="M3.5 20 9 9l4 7" />
      <path d="M11.5 13 15 6.5 20.5 20" />
    </>
  ),

  guide: (
    <>
      <circle cx="8" cy="6" r="2.5" />
      <path d="M4.5 20a3.5 4.5 0 0 1 7 0" />
      <path d="M15 4v15" />
      <path d="M15 5h5l-1.4 2L20 9h-5" />
    </>
  ),

  // carried over from the mobile set, same 24 grid and the same 1.8 stroke
  brush: (
    <>
      <path d="M14.5 3.5 20.5 9.5" />
      <path d="M17.5 6.5 10 14a3 3 0 0 1-1.6.8l-3.1.5.5-3.1A3 3 0 0 1 6.6 10.6L14.1 3.1" />
      <path d="M5.8 15.3 3.5 20.5l5.2-2.3" />
    </>
  ),

  event: (
    <>
      <rect x="3.5" y="3.5" width="17" height="11.5" rx="2" />
      <path d="M7 11.5 10 8.5l2.5 2.5L17 6.5" />
      <path d="M12 15v2.5" />
      <path d="M8.5 20.5 12 17.5l3.5 3" />
    </>
  ),

  // the pair every password field now carries, drawn as an almond rather than a circle so the open one is not read as a target
  eye: (
    <>
      <path d="M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),

  eyeOff: (
    <>
      <path d="M4 4.5 20 19.5" />
      <path d="M9.6 6.3A8.6 8.6 0 0 1 12 6c6 0 9.4 6 9.4 6a16 16 0 0 1-3.3 3.9" />
      <path d="M15.2 15.3A8.4 8.4 0 0 1 12 18c-6 0-9.4-6-9.4-6a16 16 0 0 1 4.3-4.6" />
      <path d="M10.2 10.4a3 3 0 0 0 4 4.2" />
    </>
  ),

  // two arcs meeting at a point rather than the rounded lobes a heart usually gets, so it sits in the same drawn-in-one-stroke family as the rest
  heart: (
    <path d="M12 20.2S3.8 15.4 3.8 9.6a4.4 4.4 0 0 1 8.2-2.3 4.4 4.4 0 0 1 8.2 2.3c0 5.8-8.2 10.6-8.2 10.6Z" />
  ),

  heritage: (
    <>
      <path d="M3.5 9.5 12 4l8.5 5.5" />
      <path d="M4.5 9.5v9" />
      <path d="M19.5 9.5v9" />
      <path d="M9 12v6.5" />
      <path d="M15 12v6.5" />
      <path d="M3 20.5h18" />
    </>
  ),

  // what the traveller and the provider say to each other, drawn as a rounded speech rather than a bubble with a tail, which at 24 and a 1.8 stroke reads as a smudge
  message: (
    <>
      <path d="M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H12l-4.5 3.5V17H4.5A1.5 1.5 0 0 1 3 15.5v-8a1.5 1.5 0 0 1 1.5-1.5Z" />
    </>
  ),

  // the plus without its upright, added for the stepper, where close would have meant cancel rather than one fewer
  minus: <path d="M5 12h14" />,

  moon: <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />,

  nature: (
    <>
      <path d="M12 21v-6" />
      <path d="M12 15c-3.6 0-5.6-2.3-5.6-5.2 0-3.3 2.6-6.3 5.6-6.3s5.6 3 5.6 6.3c0 2.9-2 5.2-5.6 5.2Z" />
      <path d="M12 15V6.5" />
      <path d="M12 10 9.5 8" />
      <path d="M12 12l2.5-2" />
    </>
  ),

  // the categories a place is filtered by, the seven the set had no glyph for; bed, food, car and hike already stood for the other five
  pool: (
    <>
      <path d="M3 18.5c1.6 0 1.6-1.4 3.2-1.4s1.6 1.4 3.2 1.4 1.6-1.4 3.2-1.4 1.6 1.4 3.2 1.4 1.6-1.4 3.2-1.4" />
      <path d="M7.5 14.5V6a2 2 0 0 1 4 0" />
      <path d="M16.5 14.5V6a2 2 0 0 0-4 0" />
      <path d="M7.5 10h9" />
    </>
  ),

  // the paper plane, turned the way a thing being sent goes: up and to the right
  send: (
    <>
      <path d="M20.5 3.5 3.5 10.2l6.6 2.9 2.4 7 8-16.6Z" />
      <path d="M10.1 13.1 20.5 3.5" />
    </>
  ),

  // a four pointed star with two smaller ones beside it, which is how an assisted answer is written everywhere; drawn in the stroke rather than filled, since nothing else in the set is filled
  sparkle: (
    <>
      <path d="M11 4.2 12.6 8.4 16.8 10 12.6 11.6 11 15.8 9.4 11.6 5.2 10 9.4 8.4Z" />
      <path d="M18 4v3" />
      <path d="M16.5 5.5h3" />
      <path d="M17 16v2.4" />
      <path d="M15.8 17.2h2.4" />
    </>
  ),

  sport: (
    <>
      <path d="M3.5 8.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v1.3a2.2 2.2 0 0 0 0 4.4v1.3a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-1.3a2.2 2.2 0 0 0 0-4.4Z" />
      <path d="M14 6.5v2" />
      <path d="M14 11v2" />
      <path d="M14 15.5v2" />
    </>
  ),

  // the appearance three: a sun for the light mode, a crescent for the dark one, and a brush for the screen that chooses between them
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="M5.6 5.6 7 7" />
      <path d="M17 17l1.4 1.4" />
      <path d="M18.4 5.6 17 7" />
      <path d="M7 17l-1.4 1.4" />
    </>
  ),

  tent: (
    <>
      <path d="M2.5 19.5h19" />
      <path d="M12 7 5 19.5" />
      <path d="M12 7l7 12.5" />
      <path d="M10 4.5 13.6 8" />
      <path d="M14 4.5 10.4 8" />
      <path d="M12 19.5v-6.5" />
    </>
  ),

  // the account designs define this one locally rather than in the shared library, so it is ported from their own symbol sheet
  wallet: (
    <>
      <rect x="3.5" y="6" width="17" height="13" rx="2.5" />
      <path d="M3.5 10h17" />
      <circle cx="16.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),

  water: (
    <>
      <path d="M4 5.5h16" />
      <path d="M7.5 5.5v10" />
      <path d="M12 5.5v10" />
      <path d="M16.5 5.5v10" />
      <path d="M3.5 19c1.8 0 1.8-1.4 3.6-1.4s1.8 1.4 3.6 1.4 1.8-1.4 3.6-1.4 1.8 1.4 3.6 1.4" />
    </>
  ),
} as const;

type ZebooIconName = keyof typeof iconPaths;

// every glyph the set holds, so a catalogue cannot fall behind the file it documents
const zebooIconNames = Object.keys(iconPaths) as ZebooIconName[];

type ZebooIconProps = React.ComponentProps<'svg'> & {
  name: ZebooIconName;
};

function ZebooIcon({
  name,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  ...props
}: ZebooIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('inline-block h-[1em] w-[1em] align-[-0.14em]', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
      {...props}
    >
      {iconPaths[name]}
    </svg>
  );
}

export { iconPaths, ZebooIcon, zebooIconNames };
export type { ZebooIconName };
