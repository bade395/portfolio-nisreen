import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const html = readFileSync('index.html', 'utf8');
const jsPath = 'assets/js/portfolio.js';
if (!existsSync(jsPath)) throw new Error('Missing JavaScript: ' + jsPath);
const js = readFileSync(jsPath, 'utf8');
new Function(js);
const refs = [...html.matchAll(/(?:src|poster)=["']([^"']+\.(?:webp|mp4|jpg|png))["']/gi)].map(m => m[1]);
for (const m of js.matchAll(/["'](assets\/(?:images|videos|posters)\/[^"']+)["']/g)) refs.push(m[1]);
const unique = [...new Set(refs)].filter(p => !p.startsWith('http'));
const missing = unique.filter(p => !existsSync(resolve(p)));
console.log('Checked ' + unique.length + ' referenced media paths.');
if (missing.length) {
  console.error('Missing media files (' + missing.length + '):');
  for (const p of missing) console.error(' - ' + p);
  process.exitCode = 1;
} else console.log('All referenced media files are present.');
