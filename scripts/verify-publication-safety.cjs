const fs = require('node:fs');
const path = require('node:path');

const forbidden = [
  /private\s*key/i,
  /proof\s*secret/i,
  /recipient\s*(phone|email|record)/i,
  /private\s*coordinate/i,
  /raw\s*address/i,
  /password\s*=/i,
  /api[_-]?key\s*=/i,
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'local') {
        return [];
      }
      return walk(full);
    }
    return [full];
  });
}

let scanned = 0;
for (const file of walk('.')) {
  if (!/\.(md|ts|json|cjs)$/.test(file)) {
    continue;
  }
  if (file.includes(`${path.sep}scripts${path.sep}verify-publication-safety.cjs`)) {
    continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  scanned += 1;
  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      throw new Error(`Publication safety pattern ${pattern} found in ${file}`);
    }
  }
}

console.log(`Publication safety scan passed for ${scanned} text file(s).`);
