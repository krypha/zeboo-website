import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

export interface AndroidBuild {
  version: string;
  bytes: number;
  builtAt: string;
}

const DIR = join(process.cwd(), 'public/app');

// read once while the page is being built, never at request time: the landing is prerendered and this is what decides whether the band offers a file or says it is coming
export async function androidBuild(): Promise<AndroidBuild | null> {
  try {
    const [manifest, apk] = await Promise.all([
      readFile(join(DIR, 'zeboo.json'), 'utf8'),
      stat(join(DIR, 'zeboo.apk')),
    ]);

    if (!apk.isFile() || apk.size === 0) return null;

    const read = JSON.parse(manifest) as Partial<AndroidBuild>;

    if (!read.version) return null;

    // the file on disk is the authority for its own size, the note beside it only for the version
    return {
      version: read.version,
      bytes: apk.size,
      builtAt: read.builtAt ?? '',
    };
  } catch {
    // no build posted yet, which is a state the band knows how to say
    return null;
  }
}

// one decimal is as fine as a download size deserves
export function megabytes(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(1);
}
