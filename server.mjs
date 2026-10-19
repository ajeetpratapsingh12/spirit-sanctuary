import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const option = (name, fallback) => process.argv.find(v => v.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const requested = option('dir', '.');
if (!['.', 'dist'].includes(requested)) throw new Error('Use --dir=dist or the default project directory.');
const base = resolve(root, requested);
const host = option('host', '127.0.0.1');
const port = Number(option('port', process.env.PORT || '5175'));
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port.');
const allowed = new Set(['index.html', 'play-offline.html', 'three.min.js', 'ui.css',
  'painted-garden-stone.jpg', 'gameplay-preview.png', 'LICENSE', 'NOTICE',
  'THREE-LICENSE.txt', 'TAILWIND-LICENSE.txt', 'README.md', 'ATTRIBUTION.md', 'ASSETS.md', 'AI_DISCLOSURE.md']);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const name = path === '/' ? 'index.html' : path.slice(1);
    if (!allowed.has(name)) { res.writeHead(404); res.end('Not found'); return; }
    const bytes = await readFile(resolve(base, name));
    res.writeHead(200, { 'Content-Type': types[extname(name)] || 'text/plain; charset=utf-8',
      'Content-Length': bytes.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, host, () => console.log(`Spirit Sanctuary: http://${host}:${port}/ (${requested})`));
