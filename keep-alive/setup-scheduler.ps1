# Supabase Keep-Alive - Configuração Automática
# GreenToastSoftware
#
# Este script cria uma tarefa agendada no Windows Task Scheduler
# que executa o keep-alive a cada 3 dias automaticamente.
#
# REQUISITOS:
#   - Executar como Administrador (botão direito → Executar como Admin)
#   - Node.js instalado e acessível no PATH
#   - config.json preenchido com email e senha do admin
#
# Para remover a tarefa: 
#   Unregister-ScheduledTask -TaskName "SupabaseKeepAlive" -Confirm:$false

param(
    [int]$IntervalDays = 3
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Supabase Keep-Alive — Setup Automático"   -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está a correr como admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "AVISO: Este script deve ser executado como Administrador!" -ForegroundColor Red
    Write-Host "Clique com botão direito no PowerShell e escolha 'Executar como Administrador'." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Caminhos
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$keepAliveScript = Join-Path $scriptDir "supabase-keepalive.js"
$configFile = Join-Path $scriptDir "config.json"

# Verificar ficheiros
if (-not (Test-Path $keepAliveScript)) {
    Write-Host "ERRO: supabase-keepalive.js não encontrado em $scriptDir" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $configFile)) {
    Write-Host "ERRO: config.json não encontrado em $scriptDir" -ForegroundColor Red
    exit 1
}

# Verificar se o config está preenchido
$configContent = Get-Content $configFile -Raw | ConvertFrom-Json
if ($configContent.ADMIN_EMAIL -eq "SEU_EMAIL_ADMIN_AQUI") {
    Write-Host "ERRO: Preencha o ADMIN_EMAIL e ADMIN_PASSWORD no config.json primeiro!" -ForegroundColor Red
    exit 1
}

# Verificar Node.js
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Host "ERRO: Node.js não encontrado no PATH!" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js encontrado: $($nodePath.Source)" -ForegroundColor Green

# Nome da tarefa
$taskName = "SupabaseKeepAlive_GreenToast"

# Remover tarefa existente se houver
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Tarefa existente encontrada, a substituir..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Criar a ação — executar Node.js com o script
$action = New-ScheduledTaskAction `
    -Execute $nodePath.Source `
    -Argument "`"$keepAliveScript`"" `
    -WorkingDirectory $scriptDir

# Trigger: a cada N dias, começando agora
$trigger = New-ScheduledTaskTrigger `
    -Daily `
    -DaysInterval $IntervalDays `
    -At (Get-Date).ToString("HH:mm")

# Configurações: executar mesmo se utilizador não estiver logado, permitir em bateria
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
    -RestartCount 2 `
    -RestartInterval (New-TimeSpan -Minutes 10)

# Registrar a tarefa (executa como o utilizador atual)
Register-ScheduledTask `
    -TaskName $taskName `
    -Description "Mantém o projeto Supabase da GreenToastSoftware ativo fazendo login/logout automático a cada $IntervalDays dias." `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -RunLevel Limited | Out-Null

Write-Host ""
Write-Host "Tarefa agendada criada com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "  Nome:       $taskName" -ForegroundColor White
Write-Host "  Intervalo:  A cada $IntervalDays dias" -ForegroundColor White
Write-Host "  Hora:       $(Get-Date -Format 'HH:mm')" -ForegroundColor White
Write-Host "  Script:     $keepAliveScript" -ForegroundColor White
Write-Host ""
Write-Host "Para verificar: Get-ScheduledTask -TaskName '$taskName' | Format-List" -ForegroundColor Gray
Write-Host "Para remover:   Unregister-ScheduledTask -TaskName '$taskName'" -ForegroundColor Gray
Write-Host "Para testar:    Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor Gray
Write-Host ""

# Testar agora?
$testar = Read-Host "Deseja executar o keep-alive agora para testar? (S/N)"
if ($testar -eq 'S' -or $testar -eq 's') {
    Write-Host ""
    Write-Host "A executar teste..." -ForegroundColor Yellow
    & node $keepAliveScript
    Write-Host ""
    Write-Host "Teste concluído!" -ForegroundColor Green
}

Write-Host ""
Read-Host "Pressione Enter para sair"
