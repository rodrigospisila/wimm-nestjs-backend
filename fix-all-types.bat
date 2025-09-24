@echo off
echo 🔧 Corrigindo todos os erros de tipos do Prisma

REM Criar arquivo de tipos temporários
echo 📝 Criando tipos temporários...
(
echo // Tipos temporários para corrigir erros de compilação
echo export enum ThemePreference {
echo   LIGHT = 'LIGHT',
echo   DARK = 'DARK',
echo   SYSTEM = 'SYSTEM'
echo }
echo.
echo export enum CategoryType {
echo   INCOME = 'INCOME',
echo   EXPENSE = 'EXPENSE'
echo }
echo.
echo export enum WalletGroupType {
echo   DIGITAL_WALLET = 'DIGITAL_WALLET',
echo   TRADITIONAL_BANK = 'TRADITIONAL_BANK',
echo   CASH = 'CASH',
echo   INVESTMENT = 'INVESTMENT'
echo }
echo.
echo export enum PaymentMethodType {
echo   CREDIT_CARD = 'CREDIT_CARD',
echo   DEBIT_CARD = 'DEBIT_CARD',
echo   PIX = 'PIX',
echo   WALLET_BALANCE = 'WALLET_BALANCE',
echo   BANK_ACCOUNT = 'BANK_ACCOUNT'
echo }
) > src/types/prisma-enums.ts

REM Substituir imports em todos os arquivos
echo 🔄 Corrigindo imports...

REM Corrigir auth/dto/register.dto.ts
powershell -Command "(Get-Content 'src/auth/dto/register.dto.ts') -replace 'import { ThemePreference } from ''@prisma/client'';', 'import { ThemePreference } from ''../types/prisma-enums'';' | Set-Content 'src/auth/dto/register.dto.ts'"

REM Corrigir categories
powershell -Command "(Get-Content 'src/categories/categories.controller.ts') -replace 'import { CategoryType } from ''@prisma/client'';', 'import { CategoryType } from ''../types/prisma-enums'';' | Set-Content 'src/categories/categories.controller.ts'"
powershell -Command "(Get-Content 'src/categories/categories.service.ts') -replace 'import { CategoryType } from ''@prisma/client'';', 'import { CategoryType } from ''../types/prisma-enums'';' | Set-Content 'src/categories/categories.service.ts'"
powershell -Command "(Get-Content 'src/categories/dto/create-category.dto.ts') -replace 'import { CategoryType } from ''@prisma/client'';', 'import { CategoryType } from ''../../types/prisma-enums'';' | Set-Content 'src/categories/dto/create-category.dto.ts'"

REM Corrigir wallets
powershell -Command "(Get-Content 'src/wallets/dto/create-payment-method.dto.ts') -replace 'import { PaymentMethodType } from ''@prisma/client'';', 'import { PaymentMethodType } from ''../../types/prisma-enums'';' | Set-Content 'src/wallets/dto/create-payment-method.dto.ts'"
powershell -Command "(Get-Content 'src/wallets/dto/create-wallet-group.dto.ts') -replace 'import { WalletGroupType } from ''@prisma/client'';', 'import { WalletGroupType } from ''../../types/prisma-enums'';' | Set-Content 'src/wallets/dto/create-wallet-group.dto.ts'"
powershell -Command "(Get-Content 'src/wallets/payment-methods.service.ts') -replace 'import { PaymentMethodType } from ''@prisma/client'';', 'import { PaymentMethodType } from ''../types/prisma-enums'';' | Set-Content 'src/wallets/payment-methods.service.ts'"
powershell -Command "(Get-Content 'src/wallets/wallet-groups.service.ts') -replace 'import { WalletGroupType } from ''@prisma/client'';', 'import { WalletGroupType } from ''../types/prisma-enums'';' | Set-Content 'src/wallets/wallet-groups.service.ts'"
powershell -Command "(Get-Content 'src/wallets/wallets-v2.controller.ts') -replace 'import { WalletGroupType, PaymentMethodType } from ''@prisma/client'';', 'import { WalletGroupType, PaymentMethodType } from ''../types/prisma-enums'';' | Set-Content 'src/wallets/wallets-v2.controller.ts'"

REM Corrigir subCategories para subcategories
echo 🔄 Corrigindo nomes de relações...
powershell -Command "(Get-Content 'src/categories/categories.service.ts') -replace 'subCategories', 'subcategories' | Set-Content 'src/categories/categories.service.ts'"

echo ✅ Correções aplicadas!
echo 🧪 Testando compilação...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Compilação bem-sucedida!
    echo 🚀 Iniciando backend...
    npm run start:dev
) else (
    echo ❌ Ainda há erros. Verifique os logs acima.
)

pause
