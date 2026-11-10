import { megabytes } from './android-build';

describe('megabytes', () => {
  // the figure a traveller reads before tapping, rounded the way a download size is said
  it('says the size the way a download is announced', () => {
    expect(megabytes(78_643_200)).toBe('75.0');
    expect(megabytes(1024 * 1024)).toBe('1.0');
    expect(megabytes(1_600_000)).toBe('1.5');
  });
});
