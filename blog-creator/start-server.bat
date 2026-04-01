@echo off
title Blog Version Creator - Server
color 0A
echo.
echo ========================================
echo    Blog Version Creator - GreenToast
echo ========================================
echo.

cd /d "%~dp0"

:: Verificar se Node.js esta no PATH
where node >nul 2>nul
if %ERRORLEVEL%==0 (
    echo Node.js encontrado no PATH
    goto :start
)

:: Tentar locais comuns do Node.js
if exist "%ProgramFiles%\nodejs\node.exe" (
    set "NODE_PATH=%ProgramFiles%\nodejs"
    echo Node.js encontrado em: %NODE_PATH%
    goto :startWithPath
)

if exist "F:\Programas\nodejs\node.exe" (
    set "NODE_PATH=F:\Programas\nodejs"
    echo Node.js encontrado em: %NODE_PATH%
    goto :startWithPath
)

if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "NODE_PATH=%LOCALAPPDATA%\Programs\nodejs"
    echo Node.js encontrado em: %NODE_PATH%
    goto :startWithPath
)

if exist "%APPDATA%\npm\node.exe" (
    set "NODE_PATH=%APPDATA%\npm"
    echo Node.js encontrado em: %NODE_PATH%
    goto :startWithPath
)

:: Node.js nao encontrado
color 0C
echo.
echo ERRO: Node.js nao foi encontrado!
echo.
echo Para usar o Blog Version Creator, instale o Node.js:
echo   1. Acesse: https://nodejs.org
echo   2. Baixe a versao LTS (recomendada)
echo   3. Instale e reinicie o computador
echo   4. Execute este arquivo novamente
echo.
pause
exit /b 1

:startWithPath
set "PATH=%NODE_PATH%;%PATH%"

:start
echo.
echo Iniciando servidor...
echo.
echo Abra no navegador: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.
node server.js
if %ERRORLEVEL% neq 0 (
    color 0C
    echo.
    echo ERRO ao iniciar o servidor!
    echo Verifique se o Node.js esta instalado corretamente.
)
pause
