import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const output = resolve(root, 'dist');
const read = name => readFile(resolve(root, name), 'utf8');
const [html, css, three, projectLicense, threeLicense, tailwindLicense, texture] = await Promise.all([
  read('index.html'), read('ui.css'), read('three.min.js'), read('LICENSE'),
  read('THREE-LICENSE.txt'), read('TAILWIND-LICENSE.txt'),
  readFile(resolve(root, 'painted-garden-stone.jpg'))
]);
const notices = `\n<!-- Project license:\n${projectLicense}\nThree.js license:\n${threeLicense}\nTailwind CSS license:\n${tailwindLicense}\nAI-generated texture: see ASSETS.md and AI_DISCLOSURE.md.\n-->`;
const offline = html.replace('<!DOCTYPE html>', '<!DOCTYPE html>' + notices)
  .replace('<link rel="stylesheet" href="./ui.css">', `<style>${css}</style>`)
  .replace('<script src="./three.min.js"></script>', `<script>${three}</script>`)
  .replaceAll('./painted-garden-stone.jpg', 'data:image/jpeg;base64,' + texture.toString('base64'));
if (offline.includes('src="./three.min.js"') || offline.includes('href="./ui.css"') || offline.includes("load('./painted")) {
  throw new Error('Offline packaging did not replace all runtime dependencies.');
}
await writeFile(resolve(root, 'play-offline.html'), offline);
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'three.min.js', 'ui.css', 'painted-garden-stone.jpg',
  'play-offline.html', 'LICENSE', 'NOTICE', 'THREE-LICENSE.txt', 'TAILWIND-LICENSE.txt',
  'ATTRIBUTION.md', 'ASSETS.md', 'AI_DISCLOSURE.md', '.nojekyll']) {
  await copyFile(resolve(root, file), resolve(output, file));
}
console.log('Built dist/ and self-contained play-offline.html. No dependencies or downloads required.');
