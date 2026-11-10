'use client';

import { ErrorScreen } from '@/components/layout/error-screen';

// the boundary sits under the layout, so a page that gave way keeps its header and its doors rather than taking the whole frame down
export default function LocaleError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorScreen {...props} />;
}
