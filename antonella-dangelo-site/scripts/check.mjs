// Checks that every local file referenced by the site exists and every #anchor has a target.
// Usage: node scripts/check.mjs
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = resolve('public');
let problems = 0;
const fail = (m) => { problems++; console.error('✗ ' + m); };

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function checkRef(ref, fromFile) {
  if (!ref || /^(https?:|mailto:|tel:|data:|#|\/\/)/.test(ref)) return;
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return;
  const target = clean.startsWith('/') ? join(root, clean) : resolve(dirname(fromFile), clean);
  if (!existsSync(target)) fail(`${fromFile.replace(root, '')} → missing file: ${ref}`);
}

for (const file of walk(root)) {
  if (file.endsWith('.html')) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/\b(?:href|src|poster)="([^"]*)"/g)) checkRef(m[1], file);
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) fail(`${file.replace(root, '')} → no element with id "${m[1]}"`);
  } else if (file.endsWith('.css')) {
    const css = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')                 // ignore comments
      .replace(/url\(\s*(["'])data:[\s\S]*?\1\s*\)/g, ''); // ignore inline data: URIs
    for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) checkRef(m[1], file);
  }
}

const needDomain = ['index.html', 'sitemap.xml', 'robots.txt']
  .filter((f) => readFileSync(join(root, f), 'utf8').includes('YOUR-DOMAIN.com'));
if (needDomain.length) console.warn(`! Still contains YOUR-DOMAIN.com: ${needDomain.join(', ')} — run: npm run set-domain -- yourdomain.com`);

console.log(problems ? `\n${problems} problem(s) found.` : '✓ All local references resolve.');
process.exit(problems ? 1 : 0);
