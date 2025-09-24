const fs = require('fs');

const filePath = 'src/categories/categories.service.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Remover todas as referências a isActive
content = content.replace(/isActive: true,?\s*/g, '');
content = content.replace(/,\s*isActive: true/g, '');
content = content.replace(/where: \{\s*isActive: true\s*\}/g, 'where: {}');

// Remover soft delete (isActive: false)
content = content.replace(/data: \{ isActive: false \}/g, 'data: {}');

// Adicionar métodos auxiliares que estão faltando
const helperMethods = `
  private getTypeLabel(type: CategoryType): string {
    const labels = {
      [CategoryType.INCOME]: 'Receita',
      [CategoryType.EXPENSE]: 'Despesa',
    };
    return labels[type] || type;
  }

  private getTypeDescription(type: CategoryType): string {
    const descriptions = {
      [CategoryType.INCOME]: 'Categorias para receitas e ganhos',
      [CategoryType.EXPENSE]: 'Categorias para gastos e despesas',
    };
    return descriptions[type] || '';
  }

  private getDefaultColor(type: CategoryType): string {
    return type === CategoryType.INCOME ? '#00B894' : '#FF6B6B';
  }

  private getDefaultIcon(type: CategoryType): string {
    return type === CategoryType.INCOME ? 'trending-up' : 'trending-down';
  }
`;

// Adicionar os métodos antes da última chave
content = content.replace(/}\s*$/, helperMethods + '\n}');

// Remover métodos duplicados
const lines = content.split('\n');
const uniqueLines = [];
const seenMethods = new Set();

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const methodMatch = line.match(/async\s+(findOne|update|remove)\s*\(/);
  
  if (methodMatch) {
    const methodName = methodMatch[1];
    if (seenMethods.has(methodName)) {
      // Pular método duplicado
      let braceCount = 0;
      let foundFirstBrace = false;
      
      while (i < lines.length) {
        const currentLine = lines[i];
        for (const char of currentLine) {
          if (char === '{') {
            braceCount++;
            foundFirstBrace = true;
          } else if (char === '}') {
            braceCount--;
          }
        }
        
        if (foundFirstBrace && braceCount === 0) {
          i++; // Pular a linha de fechamento
          break;
        }
        i++;
      }
      i--; // Ajustar para o próximo loop
      continue;
    } else {
      seenMethods.add(methodName);
    }
  }
  
  uniqueLines.push(line);
}

content = uniqueLines.join('\n');

fs.writeFileSync(filePath, content);
console.log('✅ Arquivo corrigido com sucesso!');
