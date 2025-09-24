const fs = require('fs');

const filePath = 'src/categories/categories.service.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Remover métodos duplicados (manter apenas os últimos)
const lines = content.split('\n');
const filteredLines = [];
const methodsToRemove = ['getDefaultColor', 'getDefaultIcon'];
let skipUntilBrace = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Verificar se é um método duplicado (primeira ocorrência)
  const isDuplicateMethod = methodsToRemove.some(method => 
    line.includes(`private ${method}(type: string)`)
  );
  
  if (isDuplicateMethod) {
    skipUntilBrace = true;
    braceCount = 0;
    continue;
  }
  
  if (skipUntilBrace) {
    // Contar chaves para saber quando o método termina
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    // Se chegou ao final do método, parar de pular
    if (braceCount <= 0 && line.includes('}')) {
      skipUntilBrace = false;
    }
    continue;
  }
  
  filteredLines.push(line);
}

content = filteredLines.join('\n');
fs.writeFileSync(filePath, content);
console.log('✅ Métodos duplicados removidos!');
