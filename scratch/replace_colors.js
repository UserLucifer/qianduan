const fs = require('fs');
const path = require('path');

const targetDir = 'e:\\业务开发\\qianduan';
const extensions = ['.tsx', '.ts', '.css'];

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                walk(fullPath);
            }
        } else if (extensions.includes(path.extname(fullPath))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            
            if (content.includes('text-zinc-300')) {
                content = content.replace(/text-zinc-300/g, 'text-muted-foreground');
                changed = true;
            }
            if (content.includes('dark:text-zinc-300')) {
                content = content.replace(/dark:text-zinc-300/g, 'text-muted-foreground');
                changed = true;
            }
            
            if (changed) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

walk(targetDir);
