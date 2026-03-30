# Supabase Keep-Alive - GreenToastSoftware
# Interface grafica em PowerShell + Windows Forms

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

# ─── Caminhos ───
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$configFile = Join-Path $scriptDir "config.json"
$keepAliveScript = Join-Path $scriptDir "supabase-keepalive.js"
$logFile = Join-Path $scriptDir "keepalive.log"
$taskName = "SupabaseKeepAlive_GreenToast"

# ─── Carregar config ───
function Get-Config {
    if (-not (Test-Path $configFile)) { return $null }
    $raw = Get-Content $configFile -Raw -Encoding UTF8
    $raw = $raw -replace '^\xEF\xBB\xBF', ''
    return $raw | ConvertFrom-Json
}

# ─── Verificar tarefa agendada ───
function Get-TaskStatus {
    try {
        $task = Get-ScheduledTask -TaskName $taskName -ErrorAction Stop
        return "Ativo - $($task.State)"
    } catch {
        return "Nao agendado"
    }
}

# ─── Cores ───
$bgDark = [System.Drawing.Color]::FromArgb(26, 26, 46)
$bgPanel = [System.Drawing.Color]::FromArgb(22, 33, 62)
$bgLog = [System.Drawing.Color]::FromArgb(15, 15, 26)
$green = [System.Drawing.Color]::FromArgb(74, 222, 128)
$textColor = [System.Drawing.Color]::FromArgb(224, 224, 224)
$dimColor = [System.Drawing.Color]::FromArgb(136, 136, 136)
$btnPrimaryBg = [System.Drawing.Color]::FromArgb(74, 222, 128)
$btnSecondaryBg = [System.Drawing.Color]::FromArgb(51, 65, 85)
$btnDangerBg = [System.Drawing.Color]::FromArgb(127, 29, 29)
$dangerText = [System.Drawing.Color]::FromArgb(252, 165, 165)

# ─── Janela principal ───
$form = New-Object System.Windows.Forms.Form
$form.Text = "Supabase Keep-Alive - GreenToastSoftware"
$form.Size = New-Object System.Drawing.Size(520, 600)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedSingle"
$form.MaximizeBox = $false
$form.BackColor = $bgDark
$form.Font = New-Object System.Drawing.Font("Segoe UI", 9)

# ─── Titulo ───
$lblTitle = New-Object System.Windows.Forms.Label
$lblTitle.Text = "Supabase Keep-Alive"
$lblTitle.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$lblTitle.ForeColor = $green
$lblTitle.AutoSize = $true
$lblTitle.Location = New-Object System.Drawing.Point(140, 15)
$form.Controls.Add($lblTitle)

$lblSubtitle = New-Object System.Windows.Forms.Label
$lblSubtitle.Text = "GreenToastSoftware - Manter o projeto Supabase ativo"
$lblSubtitle.ForeColor = $dimColor
$lblSubtitle.AutoSize = $true
$lblSubtitle.Location = New-Object System.Drawing.Point(120, 48)
$form.Controls.Add($lblSubtitle)

# ─── Painel de estado ───
$panelStatus = New-Object System.Windows.Forms.Panel
$panelStatus.Location = New-Object System.Drawing.Point(15, 80)
$panelStatus.Size = New-Object System.Drawing.Size(475, 35)
$panelStatus.BackColor = $bgPanel
$form.Controls.Add($panelStatus)

$lblStatusDot = New-Object System.Windows.Forms.Label
$lblStatusDot.Text = [char]0x25CF
$lblStatusDot.Font = New-Object System.Drawing.Font("Segoe UI", 12)
$lblStatusDot.ForeColor = $dimColor
$lblStatusDot.Location = New-Object System.Drawing.Point(10, 5)
$lblStatusDot.AutoSize = $true
$panelStatus.Controls.Add($lblStatusDot)

$lblStatusText = New-Object System.Windows.Forms.Label
$lblStatusText.Text = "A verificar..."
$lblStatusText.ForeColor = $textColor
$lblStatusText.Location = New-Object System.Drawing.Point(32, 8)
$lblStatusText.Size = New-Object System.Drawing.Size(430, 20)
$panelStatus.Controls.Add($lblStatusText)

# ─── Configuracao ───
$lblCfgTitle = New-Object System.Windows.Forms.Label
$lblCfgTitle.Text = "CONFIGURACAO"
$lblCfgTitle.ForeColor = $dimColor
$lblCfgTitle.Font = New-Object System.Drawing.Font("Segoe UI", 8)
$lblCfgTitle.Location = New-Object System.Drawing.Point(15, 125)
$lblCfgTitle.AutoSize = $true
$form.Controls.Add($lblCfgTitle)

$panelConfig = New-Object System.Windows.Forms.Panel
$panelConfig.Location = New-Object System.Drawing.Point(15, 145)
$panelConfig.Size = New-Object System.Drawing.Size(475, 80)
$panelConfig.BackColor = $bgPanel
$form.Controls.Add($panelConfig)

$yPos = 8
foreach ($item in @(
    @{ Label = "URL:"; Name = "cfgUrl" },
    @{ Label = "Email:"; Name = "cfgEmail" },
    @{ Label = "Agendamento:"; Name = "cfgTask" }
)) {
    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = $item.Label
    $lbl.ForeColor = $dimColor
    $lbl.Location = New-Object System.Drawing.Point(12, $yPos)
    $lbl.Size = New-Object System.Drawing.Size(100, 20)
    $panelConfig.Controls.Add($lbl)

    $val = New-Object System.Windows.Forms.Label
    $val.Name = $item.Name
    $val.Text = "..."
    $val.ForeColor = $textColor
    $val.Location = New-Object System.Drawing.Point(115, $yPos)
    $val.Size = New-Object System.Drawing.Size(350, 20)
    $panelConfig.Controls.Add($val)

    $yPos += 22
}

# ─── Botoes ───
$btnRun = New-Object System.Windows.Forms.Button
$btnRun.Text = "Executar Agora"
$btnRun.Location = New-Object System.Drawing.Point(15, 238)
$btnRun.Size = New-Object System.Drawing.Size(185, 38)
$btnRun.BackColor = $btnPrimaryBg
$btnRun.ForeColor = $bgDark
$btnRun.FlatStyle = "Flat"
$btnRun.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$btnRun.FlatAppearance.BorderSize = 0
$btnRun.Cursor = [System.Windows.Forms.Cursors]::Hand
$form.Controls.Add($btnRun)

$btnSchedule = New-Object System.Windows.Forms.Button
$btnSchedule.Text = "Agendar Tarefa"
$btnSchedule.Location = New-Object System.Drawing.Point(210, 238)
$btnSchedule.Size = New-Object System.Drawing.Size(170, 38)
$btnSchedule.BackColor = $btnSecondaryBg
$btnSchedule.ForeColor = $textColor
$btnSchedule.FlatStyle = "Flat"
$btnSchedule.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$btnSchedule.FlatAppearance.BorderSize = 0
$btnSchedule.Cursor = [System.Windows.Forms.Cursors]::Hand
$form.Controls.Add($btnSchedule)

$btnRemove = New-Object System.Windows.Forms.Button
$btnRemove.Text = "X Remover"
$btnRemove.Location = New-Object System.Drawing.Point(390, 238)
$btnRemove.Size = New-Object System.Drawing.Size(100, 38)
$btnRemove.BackColor = $btnDangerBg
$btnRemove.ForeColor = $dangerText
$btnRemove.FlatStyle = "Flat"
$btnRemove.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$btnRemove.FlatAppearance.BorderSize = 0
$btnRemove.Cursor = [System.Windows.Forms.Cursors]::Hand
$form.Controls.Add($btnRemove)

# ─── Log ───
$lblLogTitle = New-Object System.Windows.Forms.Label
$lblLogTitle.Text = "LOG DE EXECUCOES"
$lblLogTitle.ForeColor = $dimColor
$lblLogTitle.Font = New-Object System.Drawing.Font("Segoe UI", 8)
$lblLogTitle.Location = New-Object System.Drawing.Point(15, 290)
$lblLogTitle.AutoSize = $true
$form.Controls.Add($lblLogTitle)

$btnRefresh = New-Object System.Windows.Forms.Button
$btnRefresh.Text = "Atualizar"
$btnRefresh.Location = New-Object System.Drawing.Point(330, 285)
$btnRefresh.Size = New-Object System.Drawing.Size(75, 25)
$btnRefresh.BackColor = $btnSecondaryBg
$btnRefresh.ForeColor = $textColor
$btnRefresh.FlatStyle = "Flat"
$btnRefresh.Font = New-Object System.Drawing.Font("Segoe UI", 8)
$btnRefresh.FlatAppearance.BorderSize = 0
$form.Controls.Add($btnRefresh)

$btnOpenLog = New-Object System.Windows.Forms.Button
$btnOpenLog.Text = "Abrir"
$btnOpenLog.Location = New-Object System.Drawing.Point(412, 285)
$btnOpenLog.Size = New-Object System.Drawing.Size(75, 25)
$btnOpenLog.BackColor = $btnSecondaryBg
$btnOpenLog.ForeColor = $textColor
$btnOpenLog.FlatStyle = "Flat"
$btnOpenLog.Font = New-Object System.Drawing.Font("Segoe UI", 8)
$btnOpenLog.FlatAppearance.BorderSize = 0
$form.Controls.Add($btnOpenLog)

$txtLog = New-Object System.Windows.Forms.RichTextBox
$txtLog.Location = New-Object System.Drawing.Point(15, 315)
$txtLog.Size = New-Object System.Drawing.Size(475, 200)
$txtLog.BackColor = $bgLog
$txtLog.ForeColor = $dimColor
$txtLog.Font = New-Object System.Drawing.Font("Consolas", 9)
$txtLog.ReadOnly = $true
$txtLog.BorderStyle = "None"
$txtLog.ScrollBars = "Vertical"
$form.Controls.Add($txtLog)

# ─── Link config ───
$lblEditCfg = New-Object System.Windows.Forms.LinkLabel
$lblEditCfg.Text = "Editar config.json"
$lblEditCfg.LinkColor = $green
$lblEditCfg.ActiveLinkColor = $green
$lblEditCfg.Location = New-Object System.Drawing.Point(195, 525)
$lblEditCfg.AutoSize = $true
$form.Controls.Add($lblEditCfg)

# ─── Funcoes auxiliares ───
function Write-Log {
    param([string]$msg, [System.Drawing.Color]$color = $dimColor)
    $ts = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] "
    $txtLog.SelectionStart = $txtLog.TextLength
    $txtLog.SelectionColor = $color
    $txtLog.AppendText("$ts$msg`r`n")
    $txtLog.ScrollToCaret()
}

function Refresh-Log {
    $txtLog.Clear()
    if (Test-Path $logFile) {
        $lines = Get-Content $logFile -Tail 40 -Encoding UTF8
        foreach ($line in $lines) {
            $c = $dimColor
            if ($line -match "OK|sucesso") { $c = $green }
            elseif ($line -match "ERRO|FATAL") { $c = [System.Drawing.Color]::FromArgb(248, 113, 113) }
            elseif ($line -match "AVISO") { $c = [System.Drawing.Color]::FromArgb(250, 204, 21) }
            elseif ($line -match "PASSO|iniciado") { $c = [System.Drawing.Color]::FromArgb(96, 165, 250) }
            $txtLog.SelectionStart = $txtLog.TextLength
            $txtLog.SelectionColor = $c
            $txtLog.AppendText("$line`r`n")
        }
        $txtLog.ScrollToCaret()
    } else {
        Write-Log "Nenhum log ainda. Execute o keep-alive primeiro." ([System.Drawing.Color]::FromArgb(96, 165, 250))
    }
}

function Refresh-Status {
    $cfg = Get-Config
    if ($cfg) {
        ($panelConfig.Controls | Where-Object { $_.Name -eq "cfgUrl" }).Text = $cfg.SUPABASE_URL
        ($panelConfig.Controls | Where-Object { $_.Name -eq "cfgEmail" }).Text = $cfg.ADMIN_EMAIL
    } else {
        ($panelConfig.Controls | Where-Object { $_.Name -eq "cfgUrl" }).Text = "config.json nao encontrado!"
        ($panelConfig.Controls | Where-Object { $_.Name -eq "cfgEmail" }).Text = "-"
    }
    
    $taskSt = Get-TaskStatus
    $taskLabel = ($panelConfig.Controls | Where-Object { $_.Name -eq "cfgTask" })
    $taskLabel.Text = $taskSt
    
    if ($taskSt -match "Ativo") {
        $taskLabel.ForeColor = $green
        $lblStatusDot.ForeColor = $green
        $lblStatusText.Text = "Tarefa agendada esta ativa"
    } else {
        $taskLabel.ForeColor = $textColor
        $lblStatusDot.ForeColor = $dimColor
        $lblStatusText.Text = "Tarefa nao agendada - clique 'Agendar Tarefa'"
    }
}

# ─── Eventos ───
$btnRun.Add_Click({
    if (-not (Test-Path $keepAliveScript)) {
        [System.Windows.Forms.MessageBox]::Show("supabase-keepalive.js nao encontrado!", "Erro", "OK", "Warning")
        return
    }
    
    $btnRun.Enabled = $false
    $btnRun.Text = "A executar..."
    $lblStatusDot.ForeColor = [System.Drawing.Color]::FromArgb(250, 204, 21)
    $lblStatusText.Text = "Keep-alive em execucao..."
    $form.Refresh()
    
    Write-Log "A iniciar keep-alive..." ([System.Drawing.Color]::FromArgb(96, 165, 250))
    
    $proc = Start-Process -FilePath "node" -ArgumentList "`"$keepAliveScript`"" -WorkingDirectory $scriptDir -WindowStyle Hidden -Wait -PassThru
    
    Refresh-Log
    
    if ($proc.ExitCode -eq 0) {
        $lblStatusDot.ForeColor = $green
        $lblStatusText.Text = "Ultima execucao concluida com sucesso"
        Write-Log "Keep-alive executado com sucesso!" $green
    } else {
        $lblStatusDot.ForeColor = [System.Drawing.Color]::FromArgb(248, 113, 113)
        $lblStatusText.Text = "Erro na execucao (codigo: $($proc.ExitCode))"
        Write-Log "Erro na execucao!" ([System.Drawing.Color]::FromArgb(248, 113, 113))
    }
    
    $btnRun.Enabled = $true
    $btnRun.Text = "Executar Agora"
})

$btnSchedule.Add_Click({
    $nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
    if (-not $nodePath) {
        [System.Windows.Forms.MessageBox]::Show("Node.js nao encontrado no PATH!", "Erro", "OK", "Warning")
        return
    }
    
    Write-Log "A criar tarefa agendada..." ([System.Drawing.Color]::FromArgb(96, 165, 250))
    
    try {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
    } catch {}
    
    $hour = (Get-Date).ToString("HH:mm")
    
    try {
        $action = New-ScheduledTaskAction -Execute "node" -Argument "`"$keepAliveScript`"" -WorkingDirectory $scriptDir
        $trigger = New-ScheduledTaskTrigger -Daily -DaysInterval 3 -At (Get-Date)
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Supabase Keep-Alive GreenToastSoftware" -Force | Out-Null
        $LASTEXITCODE = 0
    } catch {
        $result = $_.Exception.Message
        $LASTEXITCODE = 1
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Tarefa criada! A cada 3 dias as $hour" $green
        [System.Windows.Forms.MessageBox]::Show("Tarefa agendada com sucesso!`nExecuta a cada 3 dias as $hour", "Sucesso", "OK", "Information")
    } else {
        Write-Log "Erro ao criar tarefa: $result" ([System.Drawing.Color]::FromArgb(248, 113, 113))
        [System.Windows.Forms.MessageBox]::Show("Erro ao criar tarefa. Tente executar como Administrador.`n`n$result", "Erro", "OK", "Warning")
    }
    
    Refresh-Status
})

$btnRemove.Add_Click({
    $resp = [System.Windows.Forms.MessageBox]::Show("Tem a certeza que deseja remover a tarefa agendada?", "Confirmar", "YesNo", "Question")
    if ($resp -eq "Yes") {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
        Write-Log "Tarefa agendada removida" ([System.Drawing.Color]::FromArgb(250, 204, 21))
        Refresh-Status
    }
})

$btnRefresh.Add_Click({ Refresh-Log })

$btnOpenLog.Add_Click({
    if (Test-Path $logFile) {
        Start-Process notepad $logFile
    } else {
        [System.Windows.Forms.MessageBox]::Show("Ficheiro de log nao existe ainda.", "Info", "OK", "Information")
    }
})

$lblEditCfg.Add_LinkClicked({
    if (Test-Path $configFile) {
        Start-Process notepad $configFile
    }
})

# ─── Carregar dados iniciais ───
Refresh-Status
Refresh-Log
Write-Log "Aplicacao iniciada" ([System.Drawing.Color]::FromArgb(96, 165, 250))

# ─── Mostrar janela ───
[System.Windows.Forms.Application]::Run($form)
