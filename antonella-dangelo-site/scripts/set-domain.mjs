// Replaces the YOUR-DOMAIN.com placeholder (canonical, Open Graph, sitemap, robots).
// Usage: npm run set-domain -- yourdomain.com
import { readFileSync, writeFileSync } from 'node:fs';

const arg = process.argv[2];
if (!arg) { console.error('Usage: npm run set-domain -- yourdomain.com'); process.exit(1); }
const domain = arg.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

for (const f of ['public/index.html', 'public/sitemap.xml', 'public/robots.txt']) {
  const text = readFileSync(f, 'utf8');
  writeFileSync(f, text.replaceAll('YOUR-DOMAIN.com', domain));
  console.log('updated', f);
}
console.log(`Domain set to https://${domain}`);
