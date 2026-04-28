const fs = require('fs');
const file = 'e:\\业务开发\\qianduan\\components\\admin\\CatalogForms.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/className="h-11 px-8"/g, '');
content = content.replace(/h-11 px-8/g, '');
fs.writeFileSync(file, content, 'utf8');
console.log('Cleaned up CatalogForms.tsx');
