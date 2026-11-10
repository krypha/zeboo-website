#!/usr/bin/env node
import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

// the apk the site hands out, and the note beside it that says which build it is
const TARGET_DIR = resolve(process.cwd(), 'public/app');
const APK = join(TARGET_DIR, 'zeboo.apk');
const MANIFEST = join(TARGET_DIR, 'zeboo.json');

// read from the sibling repo when it is there, because that is where the number actually lives
function versionFromMobile() {
  try {
    const config = readFileSync(
      resolve(process.cwd(), '../zeboo-mobile/app.config.ts'),
      'utf8',
    );

    return /version:\s*'([^']+)'/.exec(config)?.[1] ?? null;
  } catch {
    return null;
  }
}

const [source, ...rest] = process.argv.slice(2);
const asked = rest
  .find((one) => one.startsWith('--version='))
  ?.slice('--version='.length);

if (!source) {
  console.error(
    'usage: pnpm app:android <chemin/vers/le.apk> [--version=0.0.2]',
  );
  process.exit(1);
}

const from = resolve(process.cwd(), source);
const info = await stat(from).catch(() => null);

if (!info?.isFile()) {
  console.error(`introuvable: ${from}`);
  process.exit(1);
}

const version = asked ?? versionFromMobile();

if (!version) {
  console.error(
    'version inconnue: passez --version=x.y.z, ou gardez zeboo-mobile à côté',
  );
  process.exit(1);
}

await mkdir(TARGET_DIR, { recursive: true });
await copyFile(from, APK);
await writeFile(
  MANIFEST,
  `${JSON.stringify(
    {
      version,
      bytes: info.size,
      builtAt: info.mtime.toISOString().slice(0, 10),
      source: basename(from),
    },
    null,
    2,
  )}\n`,
);

const mb = (info.size / 1024 / 1024).toFixed(1);
console.log(`zeboo ${version} posé dans public/app (${mb} Mo)`);
console.log('la bande de téléchargement le proposera au prochain build');
