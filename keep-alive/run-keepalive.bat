@echo off
:: Supabase Keep-Alive Runner
:: GreenToastSoftware
:: Executa o script de keep-alive do Supabase

echo ==========================================
echo  Supabase Keep-Alive - GreenToastSoftware
echo ==========================================
echo.

cd /d "%~dp0"
node supabase-keepalive.js

echo.
echo Script finalizado.
pause
