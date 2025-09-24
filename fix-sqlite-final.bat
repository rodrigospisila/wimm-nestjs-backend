@echo off
echo 🔧 Correção Final - SQLite para Windows

REM Parar qualquer processo
echo 📋 Limpando completamente...

REM Remover tudo relacionado ao banco
if exist "prisma\dev.db" del "prisma\dev.db"
if exist "prisma\dev.db-journal" del "prisma\dev.db-journal"
if exist "prisma\migrations" rmdir /s /q "prisma\migrations"

REM Limpar cache do Prisma
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"

echo 🔧 Gerando cliente Prisma...
npx prisma generate

echo 📊 Usando db push (sem migrações)...
npx prisma db push --force-reset

REM Verificar se funcionou
if exist "prisma\dev.db" (
    echo ✅ Banco SQLite criado com sucesso!
    echo ✅ Schema aplicado corretamente!
    echo 🚀 Testando backend...
    
    REM Testar se o backend inicia
    timeout /t 2 /nobreak > nul
    echo 🧪 Iniciando teste do backend...
    start /b npm run start:dev
    timeout /t 5 /nobreak > nul
    
    echo ✅ Backend deve estar rodando em http://localhost:3000
    echo 🎉 Correção concluída com sucesso!
) else (
    echo ❌ Erro ao criar banco
    echo 🔧 Verifique se não há processos usando o arquivo
)

echo.
echo 📋 Próximos passos:
echo 1. Verifique se o backend está rodando
echo 2. Acesse http://localhost:3000 no navegador
echo 3. Deve aparecer: "Wimm API is running!"
echo.
pause
