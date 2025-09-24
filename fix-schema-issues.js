const fs = require('fs');

// Corrigir TransactionsService
const transactionsServicePath = 'src/transactions/transactions.service.ts';
let transactionsContent = fs.readFileSync(transactionsServicePath, 'utf8');

// Remover referências a campos que não existem
transactionsContent = transactionsContent.replace(/installmentNumber: true,/g, '');
transactionsContent = transactionsContent.replace(/totalInstallments: true,/g, '');
transactionsContent = transactionsContent.replace(/installmentAmount: true,/g, '');

// Corrigir acesso a paymentMethod
transactionsContent = transactionsContent.replace(
  'await this.updatePaymentMethodBalance(existingTransaction.paymentMethod.id, difference);',
  'await this.updatePaymentMethodBalance(existingTransaction.paymentMethodId, difference);'
);

fs.writeFileSync(transactionsServicePath, transactionsContent);

// Corrigir InstallmentsService
const installmentsServicePath = 'src/transactions/installments.service.ts';
let installmentsContent = fs.readFileSync(installmentsServicePath, 'utf8');

// Remover referências a campos que não existem
installmentsContent = installmentsContent.replace(/status: InstallmentStatus\.\w+,/g, '');
installmentsContent = installmentsContent.replace(/isPaid: true,/g, '');
installmentsContent = installmentsContent.replace(/isPaid: false,/g, '');
installmentsContent = installmentsContent.replace(/totalInstallments: true,/g, '');
installmentsContent = installmentsContent.replace(/installmentNumber: true,/g, '');
installmentsContent = installmentsContent.replace(/paidInstallments: true,/g, '');

// Corrigir referências a campos do schema
installmentsContent = installmentsContent.replace(/totalInstallments/g, 'installmentCount');
installmentsContent = installmentsContent.replace(/paidInstallments/g, 'currentInstallment');
installmentsContent = installmentsContent.replace(/installmentAmount/g, 'totalAmount');

// Remover lógica de status que não existe
installmentsContent = installmentsContent.replace(
  /status: InstallmentStatus\.ACTIVE,/g, 
  ''
);

// Simplificar criação de installment
installmentsContent = installmentsContent.replace(
  /const installment = await this\.prisma\.installment\.create\(\{[\s\S]*?\}\);/,
  `const installment = await this.prisma.installment.create({
      data: {
        description: createInstallmentDto.description,
        totalAmount: createInstallmentDto.totalAmount,
        installmentCount: createInstallmentDto.installmentCount,
        startDate,
        installmentType: createInstallmentDto.installmentType,
        categoryId: createInstallmentDto.categoryId,
        paymentMethodId: createInstallmentDto.paymentMethodId,
        userId,
        notes: createInstallmentDto.notes,
      },
    });`
);

fs.writeFileSync(installmentsServicePath, installmentsContent);

console.log('✅ Problemas de schema corrigidos!');
