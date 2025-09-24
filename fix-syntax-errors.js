const fs = require('fs');

console.log('🔧 Corrigindo erros de sintaxe TypeScript...');

// Corrigir categories.service.ts
const categoriesServicePath = 'src/categories/categories.service.ts';

if (fs.existsSync(categoriesServicePath)) {
  let content = fs.readFileSync(categoriesServicePath, 'utf8');
  
  // Substituir string.INCOME por 'INCOME'
  content = content.replace(/string\.INCOME/g, "'INCOME'");
  
  // Substituir string.EXPENSE por 'EXPENSE'
  content = content.replace(/string\.EXPENSE/g, "'EXPENSE'");
  
  fs.writeFileSync(categoriesServicePath, content);
  console.log('✅ Corrigido: categories.service.ts');
} else {
  console.log('⚠️ Arquivo não encontrado: categories.service.ts');
}

// Verificar outros arquivos que podem ter o mesmo problema
const filesToCheck = [
  'src/categories/categories.controller.ts',
  'src/categories/dto/create-category.dto.ts',
  'src/auth/dto/register.dto.ts'
];

filesToCheck.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    if (content.includes('string.')) {
      content = content.replace(/string\.INCOME/g, "'INCOME'");
      content = content.replace(/string\.EXPENSE/g, "'EXPENSE'");
      content = content.replace(/string\.LIGHT/g, "'LIGHT'");
      content = content.replace(/string\.DARK/g, "'DARK'");
      content = content.replace(/string\.SYSTEM/g, "'SYSTEM'");
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Corrigido: ${filePath}`);
    }
  }
});

console.log('🎉 Correções de sintaxe concluídas!');
console.log('🧪 Execute: npm run build');
