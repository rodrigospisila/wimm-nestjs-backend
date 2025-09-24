const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo imports dos tipos Prisma...');

// Lista de arquivos para corrigir
const filesToFix = [
  'src/categories/categories.controller.ts',
  'src/categories/categories.service.ts', 
  'src/categories/dto/create-category.dto.ts',
  'src/wallets/dto/create-payment-method.dto.ts',
  'src/wallets/dto/create-wallet-group.dto.ts',
  'src/wallets/payment-methods.service.ts',
  'src/wallets/wallet-groups.service.ts',
  'src/wallets/wallets-v2.controller.ts'
];

// Mapeamento de correções
const corrections = [
  {
    from: "import { CategoryType } from '@prisma/client';",
    to: "import { CategoryType } from '../types/prisma-enums';"
  },
  {
    from: "import { CategoryType } from '@prisma/client';",
    to: "import { CategoryType } from '../../types/prisma-enums';"
  },
  {
    from: "import { PaymentMethodType } from '@prisma/client';",
    to: "import { PaymentMethodType } from '../../types/prisma-enums';"
  },
  {
    from: "import { PaymentMethodType } from '@prisma/client';",
    to: "import { PaymentMethodType } from '../types/prisma-enums';"
  },
  {
    from: "import { WalletGroupType } from '@prisma/client';",
    to: "import { WalletGroupType } from '../../types/prisma-enums';"
  },
  {
    from: "import { WalletGroupType } from '@prisma/client';",
    to: "import { WalletGroupType } from '../types/prisma-enums';"
  },
  {
    from: "import { WalletGroupType, PaymentMethodType } from '@prisma/client';",
    to: "import { WalletGroupType, PaymentMethodType } from '../types/prisma-enums';"
  },
  {
    from: /subCategories/g,
    to: "subcategories"
  }
];

filesToFix.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Aplicar correções específicas baseadas no caminho
      if (filePath.includes('dto/')) {
        content = content.replace("import { CategoryType } from '@prisma/client';", "import { CategoryType } from '../../types/prisma-enums';");
        content = content.replace("import { PaymentMethodType } from '@prisma/client';", "import { PaymentMethodType } from '../../types/prisma-enums';");
        content = content.replace("import { WalletGroupType } from '@prisma/client';", "import { WalletGroupType } from '../../types/prisma-enums';");
      } else {
        content = content.replace("import { CategoryType } from '@prisma/client';", "import { CategoryType } from '../types/prisma-enums';");
        content = content.replace("import { PaymentMethodType } from '@prisma/client';", "import { PaymentMethodType } from '../types/prisma-enums';");
        content = content.replace("import { WalletGroupType } from '@prisma/client';", "import { WalletGroupType } from '../types/prisma-enums';");
        content = content.replace("import { WalletGroupType, PaymentMethodType } from '@prisma/client';", "import { WalletGroupType, PaymentMethodType } from '../types/prisma-enums';");
      }
      
      // Corrigir subCategories para subcategories
      content = content.replace(/subCategories/g, 'subcategories');
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Corrigido: ${filePath}`);
    } else {
      console.log(`⚠️ Arquivo não encontrado: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Erro ao corrigir ${filePath}:`, error.message);
  }
});

console.log('🎉 Correções concluídas!');
console.log('🧪 Execute: npm run build');
