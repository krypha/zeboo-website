import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

// locale-aware wrappers: next/link would drop the locale prefix
export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
