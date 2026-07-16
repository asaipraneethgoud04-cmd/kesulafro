import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Simple regex to replace class="..." with className="..."
  // but only inside JSX (not perfect, but good enough for typical files)
  const newContent = content.replace(/\bclass=(["'{])/g, 'className=$1');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      fixFile(fullPath);
    }
  }
}

walkDir(path.join(process.cwd(), 'src'));
console.log('Done fixing class -> className');
