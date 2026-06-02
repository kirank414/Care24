const fs = require('fs');
const path = require('path');

const EXPORT_FILE = 'codebase_for_claude.txt';
const DIRS_TO_EXPORT = ['src', 'models', 'routes', 'middleware'];
const ALLOWED_EXTS = ['.ts', '.tsx', '.js', '.jsx'];

let output = '';

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
                traverseDir(fullPath);
            }
        } else {
            if (ALLOWED_EXTS.includes(path.extname(fullPath))) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                output += `\n\n=================================================\n`;
                output += `FILE: ${fullPath}\n`;
                output += `=================================================\n\n`;
                output += content;
            }
        }
    }
}

// Also include important root files
const rootFiles = ['package.json', 'server.ts'];
for (const file of rootFiles) {
    if (fs.existsSync(file)) {
        output += `\n\n=================================================\n`;
        output += `FILE: ${file}\n`;
        output += `=================================================\n\n`;
        output += fs.readFileSync(file, 'utf-8');
    }
}

DIRS_TO_EXPORT.forEach(dir => {
    if (fs.existsSync(dir)) {
        traverseDir(dir);
    }
});

fs.writeFileSync(EXPORT_FILE, output);
console.log(`Successfully exported codebase to ${EXPORT_FILE}`);
