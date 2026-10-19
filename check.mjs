import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import assert from 'node:assert/strict';

const root = dirname(fileURLToPath(import.meta.url));
const read = file => readFile(resolve(root, file), 'utf8');
for (const file of ['index.html', 'three.min.js', 'ui.css', 'painted-garden-stone.jpg',
  'play-offline.html', 'LICENSE', 'NOTICE', 'THREE-LICENSE.txt', 'TAILWIND-LICENSE.txt',
  'README.md', 'ATTRIBUTION.md', 'ASSETS.md', 'AI_DISCLOSURE.md', 'SUBMISSION.md', 'RULES-CHECKLIST.md']) {
  await access(resolve(root, file));
}
for (const file of ['index.html', 'play-offline.html']) {
  const html = await read(file);
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length, `${file} must contain scripts`);
  for (const [i, match] of scripts.entries()) {
    if (!/\bsrc\s*=/.test(match[1])) new Script(match[2], { filename: `${file}:script-${i + 1}` });
  }
  assert.ok(!/C:\\Users\\|file:\/\/\//i.test(html), 'No machine-specific paths');
  assert.ok(!/<(?:script|link)\b[^>]*(?:src|href)=["']https?:/i.test(html), 'Runtime must be self-contained');
}
for (const match of (await read('index.html')).matchAll(/(?:src|href)=["']\.\/([^"']+)["']/g)) {
  await access(resolve(root, match[1]));
}
assert.match(await read('LICENSE'), /Copyright \(c\) 2025 JetBrains Academy/);
assert.match(await read('NOTICE'), /jetbrains-academy\/game-course/);
const description = (await read('SUBMISSION.md')).split('<!-- description:start -->')[1]?.split('<!-- description:end -->')[0].trim();
assert.ok(description && description.length <= 500, 'Submission description must be 500 characters or fewer');
assert.equal(JSON.parse(await read('package.json')).license, 'MIT');
console.log(`Checks passed: JavaScript syntax, local assets, license notices, offline dependencies and ${description.length}-character submission description.`);
