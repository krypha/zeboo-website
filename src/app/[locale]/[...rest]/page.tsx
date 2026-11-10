import { notFound } from 'next/navigation';

// without this catch-all an unknown url under a locale falls back to next's own 404, untranslated and outside the header and footer
export default function CatchAllPage(): never {
  notFound();
}
