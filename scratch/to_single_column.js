const fs = require('fs');
const files = [
    'e:\\业务开发\\qianduan\\components\\admin\\CatalogForms.tsx',
    'e:\\业务开发\\qianduan\\app\\admins\\config\\page.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // 替换网格布局为单列
    content = content.replace(/grid-cols-2 gap-x-10 gap-y-8/g, 'grid-cols-1 gap-y-8');
    content = content.replace(/grid-cols-2 gap-4/g, 'grid-cols-1 gap-y-6');
    // 移除单列模式下不再需要的 col-span-2
    content = content.replace(/col-span-2/g, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated to single column: ${file}`);
});
