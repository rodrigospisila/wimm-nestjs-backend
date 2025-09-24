const fs = require('fs');
const path = require('path');

// Arquivos que precisam ser corrigidos
const filesToFix = [
  'src/reports/reports.service.ts',
  'src/transactions/installments-processor.service.ts',
  'src/transactions/installments.service.ts',
  'src/transactions/transactions.service.ts'
];

// Função para substituir conteúdo em arquivo
function replaceInFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ from, to }) => {
      content = content.replace(new RegExp(from, 'g'), to);
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigido: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erro ao corrigir ${filePath}:`, error.message);
  }
}

// Substituições globais
const globalReplacements = [
  // Substituir referências ao modelo wallet
  { from: 'this\\.prisma\\.wallet', to: 'this.prisma.paymentMethod' },
  { from: 'prisma\\.wallet', to: 'prisma.paymentMethod' },
  
  // Substituir referências ao modelo creditCard
  { from: 'this\\.prisma\\.creditCard', to: 'this.prisma.paymentMethod' },
  { from: 'prisma\\.creditCard', to: 'prisma.paymentMethod' },
  
  // Substituir referências ao modelo cardTransaction
  { from: 'this\\.prisma\\.cardTransaction', to: 'this.prisma.transaction' },
  { from: 'prisma\\.cardTransaction', to: 'prisma.transaction' },
  
  // Substituir includes antigos
  { from: 'wallet: true', to: 'paymentMethod: { include: { walletGroup: true } }' },
  { from: 'creditCard: true', to: 'paymentMethod: { include: { walletGroup: true } }' },
  { from: 'creditCard: \\{[^}]*\\}', to: 'paymentMethod: { include: { walletGroup: true } }' },
  
  // Substituir propriedades antigas
  { from: '\\.walletId', to: '.paymentMethodId' },
  { from: '\\.creditCardId', to: '.paymentMethodId' },
  { from: '\\.creditCard', to: '.paymentMethod' },
  { from: '\\.wallet', to: '.paymentMethod' },
  
  // Substituir where clauses
  { from: 'walletId:', to: 'paymentMethodId:' },
  { from: 'creditCardId:', to: 'paymentMethodId:' },
];

// Aplicar correções em todos os arquivos
filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    replaceInFile(filePath, globalReplacements);
  } else {
    console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
  }
});

console.log('\n🎉 Correções aplicadas! Execute npm run build para verificar.');
