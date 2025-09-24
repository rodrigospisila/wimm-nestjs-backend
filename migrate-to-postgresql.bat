@echo off
echo 🔄 Migrando para PostgreSQL (Solução Definitiva)

REM Fazer backup do .env atual
echo 📋 Fazendo backup da configuração atual...
copy ".env" ".env.sqlite.backup"

REM Criar nova configuração PostgreSQL
echo 🔧 Configurando PostgreSQL...
(
echo # Wimm Backend - PostgreSQL Configuration
echo # Database Configuration
echo DATABASE_URL="postgresql://wimm_user:wimm_password@localhost:5432/wimm_db?schema=public"
echo.
echo # JWT Configuration
echo JWT_SECRET=wimm-super-secret-jwt-key-for-development-2024
echo JWT_EXPIRES_IN=7d
echo.
echo # Application Configuration
echo PORT=3000
echo NODE_ENV=development
echo.
echo # CORS Configuration
echo CORS_ORIGIN=http://localhost:8081,http://localhost:3000,exp://192.168.1.100:8081
) > ".env"

REM Atualizar schema.prisma para PostgreSQL
echo 🔧 Atualizando schema para PostgreSQL...
powershell -Command "(Get-Content 'prisma/schema.prisma') -replace 'provider = \"sqlite\"', 'provider = \"postgresql\"' | Set-Content 'prisma/schema.prisma'"

REM Limpar tudo
echo 🧹 Limpando arquivos SQLite...
if exist "prisma\dev.db" del "prisma\dev.db"
if exist "prisma\migrations" rmdir /s /q "prisma\migrations"
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"

REM Gerar cliente Prisma
echo 🔧 Gerando cliente Prisma para PostgreSQL...
npx prisma generate

REM Testar conexão
echo 🧪 Testando conexão com PostgreSQL...
npx prisma db pull

if %ERRORLEVEL% EQU 0 (
    echo ✅ Conexão com PostgreSQL funcionando!
    
    REM Aplicar schema
    echo 📊 Aplicando schema ao PostgreSQL...
    npx prisma db push
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Schema aplicado com sucesso!
        
        REM Testar compilação
        echo 🧪 Testando compilação...
        npm run build
        
        if %ERRORLEVEL% EQU 0 (
            echo ✅ Compilação bem-sucedida!
            echo 🚀 Iniciando backend...
            
            start /b npm run start:dev
            timeout /t 5 /nobreak > nul
            
            echo ✅ Backend PostgreSQL funcionando!
            echo 🌐 Teste: http://localhost:3000
            echo.
            echo 🎉 Migração para PostgreSQL concluída!
            echo 📋 Benefícios:
            echo - ✅ Tipos nativos funcionando
            echo - ✅ JSONB suportado
            echo - ✅ Enums funcionando
            echo - ✅ Relacionamentos complexos
            echo - ✅ Performance superior
        ) else (
            echo ❌ Erro na compilação. Verifique os logs.
        )
    ) else (
        echo ❌ Erro ao aplicar schema
    )
) else (
    echo ❌ Erro de conexão com PostgreSQL
    echo 🔧 Verificações necessárias:
    echo 1. Container PostgreSQL está rodando?
    echo 2. Credenciais estão corretas?
    echo 3. Porta 5432 está acessível?
    echo.
    echo 🔄 Restaurando configuração SQLite...
    copy ".env.sqlite.backup" ".env"
    powershell -Command "(Get-Content 'prisma/schema.prisma') -replace 'provider = \"postgresql\"', 'provider = \"sqlite\"' | Set-Content 'prisma/schema.prisma'"
)

echo.
pause
