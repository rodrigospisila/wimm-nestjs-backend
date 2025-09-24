const fs = require('fs');
const path = require('path');

// Arquivo a ser corrigido
const filePath = 'src/categories/categories.service.ts';

// Ler o conteúdo do arquivo
let content = fs.readFileSync(filePath, 'utf8');

// Substituições necessárias
const replacements = [
  // Corrigir string.INCOME para CategoryType.INCOME
  { from: /string\.INCOME/g, to: 'CategoryType.INCOME' },
  { from: /string\.EXPENSE/g, to: 'CategoryType.EXPENSE' },
  
  // Corrigir subcategories para subCategories
  { from: /subcategories: true/g, to: 'subCategories: true' },
];

// Aplicar todas as substituições
replacements.forEach(replacement => {
  content = content.replace(replacement.from, replacement.to);
});

// Escrever o arquivo corrigido
fs.writeFileSync(filePath, content);

console.log('Arquivo categories.service.ts corrigido com sucesso!');
