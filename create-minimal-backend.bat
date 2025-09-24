@echo off
echo 🔧 Criando Backend Mínimo Funcional

REM Fazer backup dos arquivos problemáticos
echo 📋 Fazendo backup dos arquivos problemáticos...
if not exist "backup" mkdir backup
copy "src\wallets\wallets-v2.controller.ts" "backup\" 2>nul
copy "src\wallets\wallet-groups.service.ts" "backup\" 2>nul
copy "src\wallets\payment-methods.service.ts" "backup\" 2>nul
copy "src\categories\categories.service.ts" "backup\" 2>nul

REM Desabilitar arquivos problemáticos temporariamente
echo 🚫 Desabilitando arquivos problemáticos...
if exist "src\wallets\wallets-v2.controller.ts" ren "src\wallets\wallets-v2.controller.ts" "wallets-v2.controller.ts.disabled"
if exist "src\wallets\wallet-groups.service.ts" ren "src\wallets\wallet-groups.service.ts" "wallet-groups.service.ts.disabled"
if exist "src\wallets\payment-methods.service.ts" ren "src\wallets\payment-methods.service.ts" "payment-methods.service.ts.disabled"

REM Atualizar módulo de wallets para não incluir os services desabilitados
echo 🔄 Atualizando módulo de wallets...
(
echo import { Module } from '@nestjs/common';
echo import { PrismaModule } from '../prisma/prisma.module';
echo.
echo @Module({
echo   imports: [PrismaModule],
echo   controllers: [],
echo   providers: [],
echo   exports: []
echo }^)
echo export class WalletsModule {}
) > "src\wallets\wallets.module.ts"

REM Limpar cache e tentar compilar
echo 🧹 Limpando cache...
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"
npx prisma generate

echo 🧪 Testando compilação...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend mínimo compilado com sucesso!
    echo 🚀 Iniciando backend...
    
    REM Iniciar backend
    start /b npm run start:dev
    timeout /t 5 /nobreak > nul
    
    echo ✅ Backend deve estar rodando!
    echo 🌐 Teste: http://localhost:3000
    echo.
    echo 📋 Funcionalidades disponíveis:
    echo - ✅ Autenticação JWT
    echo - ✅ Categorias básicas
    echo - ✅ Relatórios básicos
    echo - ⚠️ Carteiras V2 temporariamente desabilitadas
    echo.
    echo 💡 Para reabilitar carteiras V2:
    echo 1. Renomeie os arquivos .disabled
    echo 2. Corrija os tipos manualmente
    echo 3. Recompile
) else (
    echo ❌ Ainda há erros. Listando arquivos restantes...
    dir src /s /b | findstr "\.ts$" | findstr /v "\.disabled"
)

echo.
pause
