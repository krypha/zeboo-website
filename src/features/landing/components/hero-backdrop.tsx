import type { CSSProperties } from 'react';

// where the baobabs have their feet, and every height below is read against it
const GROUND = 398;

// the allée des baobabs, five trees at four depths so the skyline has somewhere to go
const BAOBABS = [
  { x: 104, scale: 0.62, near: false },
  { x: 268, scale: 0.44, near: false },
  // one tree near the middle on purpose: a phone crops the scene to its centre, and without it the narrow view is bare hills
  { x: 704, scale: 0.5, near: false },
  { x: 968, scale: 0.86, near: true },
  { x: 1184, scale: 0.58, near: false },
  { x: 1352, scale: 1, near: true },
] as const;

// a bottle trunk under a bare crown, which is what the dry season leaves and the one silhouette nobody mistakes
function Baobab({
  x,
  scale,
  near,
}: {
  x: number;
  scale: number;
  near: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${GROUND}) scale(${scale}) translate(-50 -120)`}
      opacity={near ? 0.9 : 0.42}
    >
      <path d="M31 120 C36 92 35 72 37 52 C39 41 43 35 50 35 C57 35 61 41 63 52 C65 72 64 92 69 120 Z" />
      <g fill="none" strokeLinecap="round" strokeWidth={6}>
        <path d="M42 40 C34 31 25 26 15 23" />
        <path d="M46 36 C42 24 38 16 33 8" />
        <path d="M50 35 L50 9" />
        <path d="M54 36 C58 24 62 16 67 8" />
        <path d="M58 40 C66 31 75 26 85 23" />
      </g>
      <g fill="none" strokeLinecap="round" strokeWidth={3}>
        <path d="M15 23 C11 19 8 17 3 15" />
        <path d="M33 8 C31 4 29 2 26 0" />
        <path d="M67 8 C69 4 71 2 74 0" />
        <path d="M85 23 C89 19 92 17 97 15" />
      </g>
    </g>
  );
}

function Ridge({
  d,
  className,
  drift,
  pace,
}: {
  d: string;
  className: string;
  drift: string;
  pace: string;
}) {
  return (
    <g
      className={`zeboo-drift ${className}`}
      style={{ '--drift': drift, '--pace': pace } as CSSProperties}
    >
      <path d={d} />
    </g>
  );
}

// the hero's ground, behind the words: no image and no video, one svg and three css keyframes
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 1440 560"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="zeboo-sky" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0"
              style={{ stopColor: 'var(--background)', stopOpacity: 0 }}
            />
            <stop
              offset="0.55"
              style={{ stopColor: 'var(--secondary)', stopOpacity: 0.6 }}
            />
            <stop
              offset="1"
              style={{ stopColor: 'var(--secondary)', stopOpacity: 0.9 }}
            />
          </linearGradient>

          <radialGradient id="zeboo-halo">
            <stop
              offset="0"
              style={{ stopColor: 'var(--accent)', stopOpacity: 0.5 }}
            />
            <stop
              offset="1"
              style={{ stopColor: 'var(--accent)', stopOpacity: 0 }}
            />
          </radialGradient>

          {/* the trail thins out as it goes, rather than ending on an edge */}
          <linearGradient id="zeboo-trail" x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0"
              style={{ stopColor: 'var(--itinerary)', stopOpacity: 0.85 }}
            />
            <stop
              offset="0.62"
              style={{ stopColor: 'var(--itinerary)', stopOpacity: 0.5 }}
            />
            <stop
              offset="1"
              style={{ stopColor: 'var(--itinerary)', stopOpacity: 0 }}
            />
          </linearGradient>

          <linearGradient id="zeboo-bed" x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0"
              style={{ stopColor: 'var(--itinerary)', stopOpacity: 0.2 }}
            />
            <stop
              offset="1"
              style={{ stopColor: 'var(--itinerary)', stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>

        <rect width="1440" height="560" fill="url(#zeboo-sky)" />

        {/* the sun sits low and never moves; only its halo breathes */}
        <circle
          className="zeboo-glow"
          cx="1032"
          cy="300"
          r="176"
          fill="url(#zeboo-halo)"
          style={{ '--pace': '14s' } as CSSProperties}
        />
        <circle cx="1032" cy="300" r="44" className="fill-accent/65" />

        <Ridge
          className="fill-primary/14"
          drift="18px"
          pace="52s"
          d="M-60 352 C140 296 236 326 398 310 C560 294 664 250 820 274 C966 296 1086 270 1240 282 C1360 292 1440 308 1500 302 L1500 560 L-60 560 Z"
        />

        <Ridge
          className="fill-primary/26"
          drift="-26px"
          pace="64s"
          d="M-60 392 C120 352 268 374 412 358 C556 342 690 314 848 334 C1006 354 1140 334 1280 345 C1380 353 1448 366 1500 360 L1500 560 L-60 560 Z"
        />

        {/* the ground the trees stand on, drawn before them so they read as planted in it */}
        <path
          className="fill-deep/80"
          d="M-60 462 C130 438 300 452 470 442 C640 432 790 408 950 424 C1110 440 1250 430 1380 438 C1440 442 1480 448 1500 444 L1500 560 L-60 560 Z"
        />

        <g className="fill-deep stroke-deep">
          {BAOBABS.map((tree) => (
            <Baobab key={tree.x} {...tree} />
          ))}
        </g>

        {/* the rn7 as the trail the itinerary draws, in the laterite that never follows the mode */}
        <path
          d="M-40 556 C150 512 290 486 430 452 C560 420 660 398 800 388 C900 381 980 380 1052 384"
          fill="none"
          strokeLinecap="round"
          strokeWidth="17"
          stroke="url(#zeboo-bed)"
        />

        <path
          d="M-40 556 C150 512 290 486 430 452 C560 420 660 398 800 388 C900 381 980 380 1052 384"
          fill="none"
          strokeLinecap="round"
          strokeWidth="5"
          strokeDasharray="22 32"
          stroke="url(#zeboo-trail)"
          className="zeboo-road"
          style={{ '--pace': '7s' } as CSSProperties}
        />
      </svg>
    </div>
  );
}
