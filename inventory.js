const fs = require('fs');
const path = require('path');

function findFiles(dir, pattern, excludes = []) {
  const results = [];
  function recurse(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);
      const relPath = path.relative('C:\\CFH', fullPath);
      if (excludes.some(ex => relPath.includes(ex))) continue;
      if (item.isDirectory()) {
        recurse(fullPath);
      } else if (item.isFile() && fullPath.match(pattern)) {
        results.push(relPath);
      }
    }
  }
  recurse(dir);
  return results;
}

const excludes = ['node_modules', '.venv', 'dist', 'build', '.git'];
const legacyPattern = /\.(js|jsx)$/i; // Only legacy JS/JSX, skip existing TS
const legacyFiles = [
  ...findFiles(path.join('C:\\CFH', 'frontend', 'src'), legacyPattern, excludes),
  ...findFiles(path.join('C:\\CFH', 'backend'), legacyPattern, excludes)
];

const missing = [];
for (const legacyFile of legacyFiles) {
  const expectedMd = 'docs/' + path.dirname(legacyFile) + '/' + path.basename(legacyFile, path.extname(legacyFile)) + '.md';
  const fullExpectedPath = path.join('C:\\CFH', expectedMd);
  if (!fs.existsSync(fullExpectedPath)) {
    missing.push(legacyFile);
  }
}

const mdFilesRaw = findFiles(path.join('C:\\CFH', 'docs'), /\.md$/i, excludes);
const existingMatches = legacyFiles.length - missing.length; // Inferred from loop

fs.writeFileSync('missing-md-list.txt', missing.join('\n'));
console.log(`Total legacy JS/JSX: ${legacyFiles.length}, Existing matching .md: ${existingMatches}, Missing: ${missing.length}`);