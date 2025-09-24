@echo off
echo 🔄 Usando Schema Simplificado para SQLite

REM Fazer backup do schema atual
echo 📋 Fazendo backup do schema atual...
copy "prisma\schema.prisma" "prisma\schema.prisma.backup"

REM Usar schema simplificado
echo 🔄 Aplicando schema simplificado...
copy "schema-simple.prisma" "prisma\schema.prisma"

REM Limpar tudo
echo 🧹 Limpando arquivos antigos...
if exist "prisma\dev.db" del /f "prisma\dev.db"
if exist "prisma\migrations" rmdir /s /q "prisma\migrations"
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"

REM Gerar cliente
echo 🔧 Gerando cliente Prisma...
npx prisma generate

REM Aplicar schema
echo 📊 Aplicando schema ao banco...
npx prisma db push --accept-data-loss

REM Verificar resultado
if exist "prisma\dev.db" (
    echo ✅ Banco criado com schema simplificado!
    echo 🚀 Iniciando backend...
    
    start /b npm run start:dev
    timeout /t 5 /nobreak > nul
    
    echo ✅ Backend deve estar funcionando!
    echo 🌐 Teste: http://localhost:3000
    
    echo.
    echo 📋 Se funcionou, você pode:
    echo 1. Usar este schema simplificado
    echo 2. Ou restaurar o original: copy prisma\schema.prisma.backup prisma\schema.prisma
) else (
    echo ❌ Ainda com erro. Recomendo usar PostgreSQL.
    echo 🔄 Restaurando schema original...
    copy "prisma\schema.prisma.backup" "prisma\schema.prisma"
)

echo.
pause
