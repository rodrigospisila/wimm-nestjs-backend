const fs = require('fs');

// Corrigir installments.service.ts
const installmentsPath = 'src/transactions/installments.service.ts';
if (fs.existsSync(installmentsPath)) {
  let content = fs.readFileSync(installmentsPath, 'utf8');
  
  // Substituições específicas para installments
  content = content.replace(/creditCardId/g, 'paymentMethodId');
  content = content.replace(/walletId/g, 'paymentMethodId');
  content = content.replace(/creditCard:/g, 'paymentMethod:');
  content = content.replace(/wallet:/g, 'paymentMethod:');
  content = content.replace(/\.creditCard/g, '.paymentMethod');
  content = content.replace(/\.wallet/g, '.paymentMethod');
  content = content.replace(/transactions:/g, 'Transaction:');
  
  fs.writeFileSync(installmentsPath, content);
  console.log('✅ Corrigido installments.service.ts');
}

// Corrigir installments-processor.service.ts
const processorPath = 'src/transactions/installments-processor.service.ts';
if (fs.existsSync(processorPath)) {
  let content = fs.readFileSync(processorPath, 'utf8');
  
  content = content.replace(/creditCard:/g, 'paymentMethod:');
  content = content.replace(/\.creditCard/g, '.paymentMethod');
  content = content.replace(/cardTransaction/g, 'transaction');
  content = content.replace(/walletId/g, 'paymentMethodId');
  content = content.replace(/\.wallet/g, '.paymentMethod');
  
  fs.writeFileSync(processorPath, content);
  console.log('✅ Corrigido installments-processor.service.ts');
}

console.log('🎉 Correções específicas aplicadas!');
