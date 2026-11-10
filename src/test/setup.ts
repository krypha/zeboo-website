import { cleanup } from '@testing-library/react';

import '@testing-library/jest-dom/vitest';

// globals are on, so specs never import afterEach or cleanup
afterEach(() => {
  cleanup();
});
