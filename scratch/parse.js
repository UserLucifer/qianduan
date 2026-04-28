
const fs = require("fs");
const path = require("path");

const basePath = "E:\\业务开发\\算力租赁后端\\src\\main\\java\\com\\compute\\rental\\modules";
const files = [];

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith(".java") && fullPath.includes("\\dto\\")) {
            files.push(fullPath);
        }
    }
}
walk(basePath);

const output = [];

for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const classMatch = content.match(/public\s+class\s+(\w+)/);
    if (!classMatch) continue;
    const className = classMatch[1];
    
    let tsCode = `export interface ${className} {\n`;
    
    // Find all private fields
    const fieldRegex = /private\s+([\w<>]+)\s+(\w+);/g;
    let match;
    while ((match = fieldRegex.exec(content)) !== null) {
        let javaType = match[1];
        let fieldName = match[2];
        
        let tsType = "any";
        if (["String", "LocalDateTime", "LocalDate", "Date"].includes(javaType)) tsType = "string";
        else if (["Integer", "Long", "BigDecimal", "Double", "int", "long", "double"].includes(javaType)) tsType = "number";
        else if (["Boolean", "boolean"].includes(javaType)) tsType = "boolean";
        else if (javaType.startsWith("List<")) tsType = "any[]";
        
        tsCode += `  ${fieldName}: ${tsType};\n`;
    }
    tsCode += `}\n`;
    output.push(tsCode);
}

fs.writeFileSync("scratch/generated_types.ts", output.join("\n"));
console.log("Generated " + files.length + " types");

