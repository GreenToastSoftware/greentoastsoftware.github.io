# Supabase Keep-Alive System

Sistema automático que faz login/logout numa conta admin do Supabase a cada 3 dias para evitar que o projeto fique inativo (o plano gratuito pausa após ~7 dias sem uso).

## O que faz

1. **Login** — Autentica com email/senha via API REST do Supabase
2. **Ping DB** — Faz uma consulta à base de dados para mantê-la ativa
3. **Ping Storage** — Acede ao serviço de Storage para mantê-lo ativo
4. **Logout** — Termina a sessão de forma limpa
5. **Log** — Regista tudo no ficheiro `keepalive.log`

## Configuração

### 1. Preencher credenciais

Edite o ficheiro `config.json` e substitua os valores:

```json
{
    "ADMIN_EMAIL": "seu-email@exemplo.com",
    "ADMIN_PASSWORD": "sua-senha-segura"
}
```

> ⚠️ **Não faça commit do `config.json` com credenciais reais!** 
> Adicione-o ao `.gitignore`.

### 2. Testar manualmente

Abra um terminal na pasta `keep-alive/` e execute:

```bash
node supabase-keepalive.js
```

Ou use o ficheiro `run-keepalive.bat` (duplo clique).

### 3. Agendar automaticamente (a cada 3 dias)

Abra o PowerShell **como Administrador** e execute:

```powershell
cd "caminho/para/keep-alive"
.\setup-scheduler.ps1
```

Isso cria uma tarefa no Windows Task Scheduler que executa o script a cada 3 dias.

## Ficheiros

| Ficheiro | Descrição |
|---|---|
| `config.json` | Credenciais (PREENCHER!) |
| `supabase-keepalive.js` | Script principal (Node.js, sem dependências) |
| `run-keepalive.bat` | Executar manualmente (duplo clique) |
| `setup-scheduler.ps1` | Configurar tarefa agendada no Windows |
| `keepalive.log` | Log de execuções (criado automaticamente) |

## Requisitos

- **Node.js** instalado e no PATH
- **Windows** (para o Task Scheduler)

## Comandos úteis

```powershell
# Ver estado da tarefa
Get-ScheduledTask -TaskName "SupabaseKeepAlive_GreenToast" | Format-List

# Executar agora manualmente
Start-ScheduledTask -TaskName "SupabaseKeepAlive_GreenToast"

# Remover tarefa
Unregister-ScheduledTask -TaskName "SupabaseKeepAlive_GreenToast" -Confirm:$false

# Alterar intervalo para 2 dias (exemplo)
.\setup-scheduler.ps1 -IntervalDays 2

# Ver log das últimas execuções
Get-Content keepalive.log -Tail 30
```
