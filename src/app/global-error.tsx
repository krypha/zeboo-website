'use client';

import './globals.css';

// the last resort: this one replaces the root layout itself, so it carries its own html and body and cannot read a translation catalogue, which is why it speaks the default locale alone; the stylesheet is imported here because nothing above it is left to load one
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="bg-background text-foreground font-sans antialiased">
        <main className="mx-auto flex w-full max-w-lg flex-col items-start gap-5 px-4 py-20">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Quelque chose n’a pas tenu
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Zeboo n’a pas pu afficher cette page. Vous pouvez réessayer.
          </p>

          <button
            type="button"
            onClick={reset}
            className="bg-primary text-primary-foreground font-heading rounded-xl px-5 py-[11px] text-[14.5px] font-semibold"
          >
            Réessayer
          </button>

          {error.digest && (
            <p className="text-muted-foreground text-xs">
              Référence {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
