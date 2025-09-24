const fs = require('fs');
const path = require('path');

// Função para corrigir um arquivo
function fixFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`Arquivo não encontrado: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  replacements.forEach(replacement => {
    const newContent = content.replace(replacement.from, replacement.to);
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Corrigido: ${filePath}`);
  }
}

// Corrigir categories.service.ts - subcategories restantes
fixFile('src/categories/categories.service.ts', [
  { from: /subcategories: {/g, to: 'subCategories: {' },
  { from: /subcategories: true/g, to: 'subCategories: true' },
]);

// Corrigir auth.service.ts - ThemePreference
const authServicePath = 'src/auth/auth.service.ts';
if (fs.existsSync(authServicePath)) {
  let authContent = fs.readFileSync(authServicePath, 'utf8');
  
  // Adicionar import se não existir
  if (!authContent.includes('ThemePreference')) {
    authContent = authContent.replace(
      /import.*from '@prisma\/client';/,
      `import { ThemePreference } from '@prisma/client';`
    );
  }
  
  // Corrigir tipo da variável themePreference
  authContent = authContent.replace(
    /themePreference,/g,
    'themePreference: themePreference as ThemePreference,'
  );
  
  fs.writeFileSync(authServicePath, authContent);
  console.log('Corrigido: auth.service.ts');
}

console.log('Correções aplicadas!');
