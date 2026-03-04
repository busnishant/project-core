// cleanup.js
import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    const arr = fs.readdirSync(dir);
    for (const file of arr) {
        if (file === 'node_modules' || file === '.git') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath, callback);
        } else {
            callback(fullPath);
        }
    }
}

const targetDirs = ['.'];

const extAllowed = ['.js', '.json', '.md'];

targetDirs.forEach(dir => {
    walkDir(dir, filePath => {
        if (!extAllowed.some(ext => filePath.endsWith(ext))) return;
        if (path.basename(filePath) === 'cleanup.js' || path.basename(filePath) === 'package-lock.json') return;

        let content = fs.readFileSync(filePath, 'utf8');
        const original = content;

        // Task 3: Strip generated top comments from .js files
        if (filePath.endsWith('.js')) {
            // Typically top comments are like /* ... */ or // ... at the start
            // We will remove block comments at the very beginning that contain "generated" or "scaffold" or "Antigravity"
            if (content.startsWith('/*')) {
                const endIdx = content.indexOf('*/');
                if (endIdx !== -1) {
                    const block = content.substring(0, endIdx + 2);
                    if (/generated|scaffold|Antigravity/i.test(block)) {
                        content = content.substring(endIdx + 2).replace(/^\s+/, '');
                    }
                }
            }
            // Also check // comments at very beginning
            let lines = content.split('\n');
            while (lines.length > 0 && lines[0].trim().startsWith('//')) {
                if (/generated|scaffold|Antigravity/i.test(lines[0])) {
                    lines.shift();
                } else {
                    break;
                }
            }
            content = lines.join('\n');
        }

        // Task 1: Replace terms
        // replace auto-generated first
        content = content.replace(/auto-generated/gi, '');
        content = content.replace(/generated/gi, '');
        content = content.replace(/scaffolded/gi, '');
        content = content.replace(/scaffolding/gi, '');
        content = content.replace(/scaffold/gi, '');
        content = content.replace(/AI agent/gi, '');

        // Exact case replacements
        content = content.replace(/Antigravity/g, 'projectcore');
        content = content.replace(/antigravity/g, 'projectcore');
        content = content.replace(/CoreBot/g, 'Aaradhya');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    });
});
