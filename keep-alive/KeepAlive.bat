@echo off
:: Lanca a interface grafica do Keep-Alive
:: Duplo clique para abrir
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0KeepAlive.ps1"
