const fs = require("fs");
const path = require("path");

const backendEnumDir = "E:\\业务开发\\算力租赁后端\\src\\main\\java\\com\\compute\\rental\\common\\enums";
const outputTsPath = "types/enums.ts";

let tsOutput = `// Auto-generated from backend enums\n\n`;

const files = fs.readdirSync(backendEnumDir);

for (const file of files) {
  if (!file.endsWith(".java")) continue;
  const content = fs.readFileSync(path.join(backendEnumDir, file), "utf8");
  
  const enumMatch = content.match(/public\s+enum\s+(\w+)\s*\{([\s\S]*?)\}/);
  if (!enumMatch) continue;
  
  const enumName = enumMatch[1];
  const body = enumMatch[2];
  
  // Clean comments and methods
  let cleanBody = body.replace(/\/\/.*$/gm, "");
  cleanBody = cleanBody.replace(/\/\*[\s\S]*?\*\//g, "");
  
  // Extract values
  // A standard enum is just NAME1, NAME2, NAME3(...)
  // So we split by comma until a semicolon or end
  const membersPart = cleanBody.split(';')[0];
  const members = membersPart.split(',').map(m => m.trim()).filter(m => m);
  
  tsOutput += `export enum ${enumName} {\n`;
  for (let member of members) {
    // If it has parens, e.g. ENABLED(1) or PENDING("PENDING", "Pending")
    const parenMatch = member.match(/^(\w+)\(([^)]+)\)$/);
    if (parenMatch) {
      const name = parenMatch[1];
      let val = parenMatch[2].split(',')[0].trim();
      // If val is a number, keep it as number
      if (!isNaN(val)) {
        tsOutput += `  ${name} = ${val},\n`;
      } else {
        tsOutput += `  ${name} = ${val},\n`;
      }
    } else {
      // Just NAME
      const name = member.trim();
      tsOutput += `  ${name} = "${name}",\n`;
    }
  }
  tsOutput += `}\n\n`;
}

fs.writeFileSync(outputTsPath, tsOutput);
console.log("Generated types/enums.ts");
