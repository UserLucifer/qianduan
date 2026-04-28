const fs = require('fs');
const file = 'e:\\业务开发\\qianduan\\components\\admin\\CatalogForms.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. 替换网格布局为三列
content = content.replace(/grid-cols-1 gap-y-8/g, 'grid grid-cols-3 gap-x-4 gap-y-4');
content = content.replace(/grid grid-cols-3 gap-x-4 gap-y-4 py-8/g, 'grid grid-cols-3 gap-x-4 gap-y-4 py-4');

// 2. 替换页脚为水平居中且紧凑
content = content.replace(/flex justify-end gap-3 pt-6 border-t mt-8 bg-muted\/30 -mx-10 -mb-10 p-6 px-10/g, 'flex justify-center gap-3 pt-4 border-t mt-6');

fs.writeFileSync(file, content, 'utf8');
console.log('Refactored CatalogForms.tsx to 3-column centered style');
