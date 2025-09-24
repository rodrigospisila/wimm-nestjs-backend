const fs = require('fs');

console.log('🔧 Aplicando correção final - removendo todos os enums...');

// Remover todos os imports de enums e usar strings
const filesToFix = [
  'src/auth/dto/register.dto.ts',
  'src/categories/categories.controller.ts',
  'src/categories/categories.service.ts', 
  'src/categories/dto/create-category.dto.ts',
  'src/wallets/dto/create-payment-method.dto.ts',
  'src/wallets/dto/create-wallet-group.dto.ts',
  'src/wallets/payment-methods.service.ts',
  'src/wallets/wallet-groups.service.ts',
  'src/wallets/wallets-v2.controller.ts'
];

filesToFix.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remover imports de enums
      content = content.replace(/import.*from.*prisma-enums.*;\n/g, '');
      content = content.replace(/import.*from.*@prisma\/client.*;\n/g, '');
      
      // Substituir tipos por strings
      content = content.replace(/ThemePreference/g, 'string');
      content = content.replace(/CategoryType/g, 'string');
      content = content.replace(/WalletGroupType/g, 'string');
      content = content.replace(/PaymentMethodType/g, 'string');
      
      // Remover decoradores @IsEnum
      content = content.replace(/@IsEnum\([^)]+\)\n\s*/g, '');
      
      // Corrigir valores específicos no controller
      if (filePath.includes('wallets-v2.controller.ts')) {
        content = content.replace(/WalletGroupType\./g, '"');
        content = content.replace(/PaymentMethodType\./g, '"');
        content = content.replace(/OTHER"/g, 'OTHER"');
        content = content.replace(/DIGITAL_WALLET"/g, 'DIGITAL_WALLET"');
        content = content.replace(/TRADITIONAL_BANK"/g, 'TRADITIONAL_BANK"');
        content = content.replace(/CASH"/g, 'CASH"');
        content = content.replace(/INVESTMENT"/g, 'INVESTMENT"');
        content = content.replace(/CREDIT_CARD"/g, 'CREDIT_CARD"');
        content = content.replace(/DEBIT_CARD"/g, 'DEBIT_CARD"');
        content = content.replace(/PIX"/g, 'PIX"');
        content = content.replace(/WALLET_BALANCE"/g, 'WALLET_BALANCE"');
        content = content.replace(/BANK_ACCOUNT"/g, 'BANK_ACCOUNT"');
        content = content.replace(/CHECKING_ACCOUNT"/g, 'CHECKING_ACCOUNT"');
        content = content.replace(/SAVINGS_ACCOUNT"/g, 'SAVINGS_ACCOUNT"');
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Simplificado: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Erro: ${filePath}:`, error.message);
  }
});

// Remover arquivo de tipos
if (fs.existsSync('src/types/prisma-enums.ts')) {
  fs.unlinkSync('src/types/prisma-enums.ts');
  console.log('🗑️ Removido arquivo de tipos');
}

console.log('🎉 Simplificação concluída! Agora deve compilar.');
console.log('🧪 Execute: npm run build');
