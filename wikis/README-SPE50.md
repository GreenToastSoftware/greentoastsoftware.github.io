# ?? SPE 5.0 — System Programs Easier

**Documentação da Aplicação**

---

## ?? Índice

1. [Visão Geral](#visão-geral)
2. [Informações do Projeto](#informações-do-projeto)
3. [Arquitetura](#arquitetura)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Funcionalidades](#funcionalidades)
   - [Página Principal (MainWindowPage)](#página-principal)
   - [Conversor de Moedas (Currency)](#conversor-de-moedas)
   - [Conversor de Temperaturas](#conversor-de-temperaturas)
   - [Conversor de PDF](#conversor-de-pdf)
   - [Gerador de QR Code](#gerador-de-qr-code)
   - [Verificação de Drivers](#verificação-de-drivers)
   - [CheckDisk (Verificação de Disco)](#checkdisk)
   - [Group Policy Editor (GPEdit)](#group-policy-editor)
   - [Teste de Velocidade de Internet](#teste-de-velocidade-de-internet)
   - [SPE Installer (Gestor de Pacotes)](#spe-installer)
   - [Entretenimento](#entretenimento)
   - [WINtools Remastered](#wintools-remastered)
   - [Terminal SPE](#terminal-spe)
   - [Chat Assistente (Rasa/Local)](#chat-assistente)
   - [Configurações](#configurações)
6. [Sistema de Temas](#sistema-de-temas)
7. [Sistema de Áudio](#sistema-de-áudio)
8. [Painel de Controlo de Internet](#painel-de-controlo-de-internet)
9. [Painel de Controlo de Som](#painel-de-controlo-de-som)
10. [Deteção de Localização (GPS)](#deteção-de-localização)
11. [Ecrã de Introdução e Loading](#ecrã-de-introdução-e-loading)
12. [Diálogo de Desenvolvedor](#diálogo-de-desenvolvedor)
13. [SPE Helper (Serviço Auxiliar)](#spe-helper)
14. [Instalador MSI](#instalador-msi)
15. [Dependências (NuGet)](#dependências-nuget)
16. [Atalhos de Teclado](#atalhos-de-teclado)
17. [Requisitos do Sistema](#requisitos-do-sistema)

---

## Visão Geral

**SPE 5.0** (System Programs Easier) é uma aplicação desktop WPF desenvolvida pela **GreenToastSoftware Corporation** que centraliza diversas ferramentas de sistema, utilitários e funcionalidades de produtividade numa única interface.

A aplicação é concebida para funcionar com **privilégios de administrador** e oferece desde diagnósticos de hardware/software até conversores, entretenimento e um assistente de chat integrado.

---

## Informações do Projeto

| Campo              | Valor                                         |
|--------------------|-----------------------------------------------|
| **Nome**           | SPE 5.0 (System Programs Easier 5.0)          |
| **Framework**      | .NET Framework 4.8                             |
| **Tipo de Projeto**| WPF (Windows Presentation Foundation)          |
| **Namespace raiz** | `SPE50` / `PSWRDMGR`                          |
| **Empresa**        | GreenToastSoftware Corporation                 |
| **Copyright**      | ©GreenToastSoftware Corporation 2020–2025      |
| **Versão**         | 1.0.0.0                                        |

---

## Arquitetura

A aplicação segue uma arquitetura baseada em **navegação por Frame** dentro de uma janela principal (`MainWindowHome`). As diferentes funcionalidades são implementadas como **Pages** WPF que são carregadas dinamicamente no `MainFrame`.

```
????????????????????????????????????????????????????????
?                   App.xaml / App.xaml.cs              ?
?            (Startup, Admin Elevation, MSIX check)    ?
????????????????????????????????????????????????????????
?                                                      ?
?  ?? LoadingScreen ??? Intro_Toast ???                ?
?  ?        (animação de arranque)     ?                ?
?  ?????????????????????????????????????                ?
?                                      ?                ?
?              MainWindowHome (Window)                  ?
?  ????????????????????????????????????????????????    ?
?  ?  MainFrame (Frame)                           ?    ?
?  ?  ??????????????????????????????????????????  ?    ?
?  ?  ?  MainWindowPage (Page)                 ?  ?    ?
?  ?  ?  ??? Botões de navegação               ?  ?    ?
?  ?  ?  ??? Barra de estado (Internet/Som)    ?  ?    ?
?  ?  ?  ??? Chat embebido (opcional)          ?  ?    ?
?  ?  ??????????????????????????????????????????  ?    ?
?  ?         ? Navegação para Pages:              ?    ?
?  ?  • config_page        • Currency_page        ?    ?
?  ?  • pdf_page           • QR_page              ?    ?
?  ?  • CheckDrivers_page  • Checkdisk_page       ?    ?
?  ?  • gpedit_page        • SpeedTest_page        ?    ?
?  ?  • Temp_unit_page     • SPE_installer         ?    ?
?  ?  • Entertainment      • GreenToastHelper_page ?    ?
?  ?  • Winsat_page        • GreenVisualizationPC  ?    ?
?  ?  • SPE_borders                                ?    ?
?  ????????????????????????????????????????????????    ?
?                                                      ?
?  Pop-ups / Janelas auxiliares:                        ?
?  • InternetControlPanel   • SoundControlPanel        ?
?  • SPE_terminal           • WINtoolsRemastered       ?
?  • SPE_entertainment      • dev_dialog               ?
?  • BIOS_Warning_dialog                               ?
????????????????????????????????????????????????????????
```

### Fluxo de Arranque

1. `App.OnStartup()` verifica se a app é empacotada (MSIX) via `PackageIdentityHelper`.
2. Se não empacotada e sem privilégios de administrador, reinicia com elevação (`runas`).
3. Regista handlers globais de exceções não tratadas.
4. Conforme a configuração `ShowIntroEnabled`:
   - **Ativo**: Mostra `LoadingScreen` ? após 7s abre `Intro_Toast` (animação de logo com som) ? abre `MainWindowHome`.
   - **Desativado**: Abre diretamente `MainWindowHome`.

---

## Estrutura de Pastas

```
PSWRDMGR/
??? App.xaml / App.xaml.cs          # Ponto de entrada da aplicação
??? MainWindowHome.xaml.cs          # Janela principal (host do Frame)
??? MainWindowPage.xaml.cs          # Página principal com navegação
??? dev_dialog.xaml.cs              # Diálogo de desenvolvedor (secreto)
?
??? Pages/                          # Páginas de funcionalidades
?   ??? config_page.xaml.cs         # Configurações da aplicação
?   ??? Currency_page.xaml.cs       # Conversor de moedas
?   ??? Temp_unit_page.xaml.cs      # Conversor de temperaturas
?   ??? pdf_page.xaml.cs            # Conversor de PDF
?   ??? QR_page.xaml.cs             # Gerador de QR Code
?   ??? CheckDrivers.xaml.cs        # Verificação de drivers
?   ??? Checkdisk_page.xaml.cs      # Verificação de disco
?   ??? gpedit_page.xaml.cs         # Group Policy Editor
?   ??? SpeedTest_Internet.xaml.cs  # Teste de velocidade
?   ??? SPE_Installer_page.xaml.cs  # Gestor de pacotes (Winget/Chocolatey)
?   ??? Entertainment.xaml.cs       # Entretenimento (WebView2)
?   ??? SPE_entert_plat.xaml.cs     # Plataforma de entretenimento
?   ??? GreenToastHelper.xaml.cs    # Helper interno
?   ??? WINtoolsMenu_page.xaml.cs   # Menu de ferramentas Windows
?   ??? WINtoolsRemastered.xaml.cs  # Ferramentas Windows (remastered)
?
??? Window/                         # Janelas auxiliares
?   ??? Intro_Toast.xaml.cs         # Animação de introdução
?   ??? LoadingScreen.xaml.cs       # Ecrã de carregamento
?   ??? SPE_terminal.xaml.cs        # Terminal integrado
?   ??? SPE_Entertainment.xaml.cs   # Janela de entretenimento
?   ??? Windows_welscreen.xaml.cs   # Welcome screen do Windows
?
??? Pop_ups/                        # Pop-ups de controlo
?   ??? InternetControlPanel.xaml.cs # Painel de controlo de internet
?   ??? SoundControlPanel.xaml.cs    # Painel de controlo de som
?
??? Chat/                           # Assistente de chat
?   ??? RasaChatControl.xaml.cs     # Controlo de chat (UI + lógica)
?   ??? ChatModels.cs              # Modelos de dados do chat
?
??? Themes/                         # Sistema de temas
?   ??? ThemesController.cs         # Controlador de temas
?   ??? DarkTheme.xaml              # Tema escuro
?   ??? LightTheme.xaml             # Tema claro
?   ??? ColourfulDarkTheme.xaml     # Tema escuro colorido
?   ??? ColourfulLightTheme.xaml    # Tema claro colorido
?
??? Utilities/                      # Utilitários
?   ??? WinSATCommands.cs           # Comandos WinSAT
?   ??? SPEHelperClient.cs         # Cliente do serviço SPE Helper
?
??? Dialogs/                        # Diálogos
?   ??? CurrencySelectionDialog.xaml.cs
?   ??? CurrencyEditDialog.xaml.cs
?
??? Function reports_dialogs/       # Relatórios
?   ??? pdf_converter_report.xaml.cs
?   ??? CheckDrivers_report_good.xaml.cs
?
??? Warning_dialogs/                # Avisos
?   ??? BIOS_Warning_dialog.xaml.cs
?
??? Window_events/                  # Eventos de janela
?   ??? currency_equal_cambio.xaml.cs
?   ??? pdf_convertion_finish.xaml.cs
?
??? WindowsTools/                   # Ferramentas Windows
?   ??? WINdvdInstaller.xaml.cs
?
??? TestResources/                  # Recursos de teste
?   ??? winsat.xaml.cs              # Teste WinSAT
?   ??? winsat_fixed.xaml.cs        # WinSAT corrigido
?   ??? SPE_workspace.xaml.cs       # Workspace SPE
?   ??? GreenVisualizationPC.xaml.cs # Visualização do PC
?   ??? SPE borders/               # Bordas SPE
?   ??? Windows_welscreen.cs
?
??? Properties/                     # Propriedades do projeto
?   ??? AssemblyInfo.cs
?   ??? Settings.Designer.cs
?   ??? Resources.Designer.cs
?
??? Add-ons/                        # Add-ons
?   ??? Cute_borders/
?
??? docs/                           # Documentação
    ??? README.md                   # Este ficheiro
```

---

## Funcionalidades

### Página Principal

**Ficheiro:** `MainWindowPage.xaml.cs`

A página principal serve como hub de navegação para todas as funcionalidades. Contém:
- **Barra de navegação** com botões para cada módulo
- **Indicadores de estado** (Internet e Som) na barra superior
- **Chat embebido** (acessível via atalho de teclado)
- **Menu de temas** para alternar entre os 4 temas disponíveis
- **Deteção automática de localização** no arranque

### Conversor de Moedas

**Ficheiro:** `Pages/Currency_page.xaml.cs`

- Conversão entre múltiplas moedas fiat e criptomoedas
- APIs suportadas: **ExchangeRate-API** e **CoinAPI**
- Gráficos históricos com **LiveCharts** (seleção de intervalo de datas)
- Pesquisa de moedas
- Moedas suportadas incluem: EUR, USD, GBP, JPY, BRL, BTC, ETH, LTC, XRP, ADA, entre outras
- Diálogos auxiliares: `CurrencySelectionDialog`, `CurrencyEditDialog`, `currency_equal_cambio`
- Memória de configuração persistente (`CurrencyAppMemoryEnabled`)

### Conversor de Temperaturas

**Ficheiro:** `Pages/Temp_unit_page.xaml.cs`

- Conversão entre 6 unidades: **Celsius**, **Fahrenheit**, **Kelvin**, **Rankine**, **Réaumur** e **Delisle**
- Validação de input numérico
- Controlo de colar (paste) para prevenir input inválido

### Conversor de PDF

**Ficheiro:** `Pages/pdf_page.xaml.cs`

- Conversão de ficheiros para PDF usando **Spire.PDF**
- Suporte para documentos Word (**Microsoft.Office.Interop.Word**) e PowerPoint (**Microsoft.Office.Interop.PowerPoint**)
- Seleção de múltiplos ficheiros com **Ookii.Dialogs.Wpf**
- Relatórios de conversão (`pdf_converter_report`, `pdf_convertion_finish`)
- Funcionalidade de relatório PDF configurável via `ConfigPageState.PdfReportEnabled`

### Gerador de QR Code

**Ficheiro:** `Pages/QR_page.xaml.cs`

- Geração de QR Codes a partir de URLs/texto usando **QRCoder**
- Histórico de URLs persistido em ficheiro local (`%LocalAppData%/SPE50/url_history.txt`)
- Exportação de QR Code como imagem

### Verificação de Drivers

**Ficheiro:** `Pages/CheckDrivers.xaml.cs`

- Análise completa de drivers do sistema via **WMI** (`System.Management`)
- Opções de análise: drivers desatualizados, em falta, com problemas
- Modo detalhado com relatórios
- Execução em `BackgroundWorker` para não bloquear a UI
- Estatísticas: total analisado, desatualizados, em falta, com problemas
- Relatório de resultado (`CheckDrivers_report_good`)

### CheckDisk

**Ficheiro:** `Pages/Checkdisk_page.xaml.cs`

- Interface gráfica para o utilitário **chkdsk** do Windows
- Seleção de unidade de disco (apenas discos fixos)
- Opções: corrigir erros (`/F`), recuperar sectores danificados (`/R`)
- Indicador visual do modo de operação
- Cancelamento de operação em curso (`CancellationTokenSource`)

### Group Policy Editor

**Ficheiro:** `Pages/gpedit_page.xaml.cs`

- Interface para o **gpedit.msc** (Group Policy Editor)
- Verificação de estado do GPEdit
- Execução de operações em `BackgroundWorker`
- Instalação/ativação em edições do Windows que não o incluem

### Teste de Velocidade de Internet

**Ficheiro:** `Pages/SpeedTest_Internet.xaml.cs`

- Teste de velocidade de download
- Execução assíncrona com `HttpClient`
- Timer visual durante o teste (`DispatcherTimer`)
- Cancelamento de teste em curso
- Resultados: velocidade de download

### SPE Installer

**Ficheiro:** `Pages/SPE_Installer_page.xaml.cs`

Gestor de pacotes integrado com suporte a:
- **Winget** (Windows Package Manager)
- **Chocolatey**

Funcionalidades:
- Listagem de pacotes com nome, descrição, versão, fonte e estado
- Seleção múltipla de pacotes para instalação
- Indicadores visuais de fonte (azul para Winget, roxo para Chocolatey)
- Estado de instalação colorido
- Emojis por aplicação
- Modelo `PackageInfo` com notificação de propriedades (`INotifyPropertyChanged`)

### Entretenimento

**Ficheiros:** `Pages/Entertainment.xaml.cs`, `Window/SPE_Entertainment.xaml.cs`, `Pages/SPE_entert_plat.xaml.cs`

- Navegador web integrado via **WebView2** (Microsoft.Web.WebView2)
- Página inicial: YouTube
- Certificados SSL auto-aceites para compatibilidade
- Janela dedicada com menu e frame de navegação

### WINtools Remastered

**Ficheiro:** `Pages/WINtoolsRemastered.xaml.cs`

Janela com acesso a ferramentas avançadas do Windows:
- **WinSAT** (Windows System Assessment Tool) — avaliação de desempenho
- **Welcome Screen** do Windows
- **GreenVisualizationPC** — visualização de informações do PC
- Links informativos (Wikipedia)

### Terminal SPE

**Ficheiro:** `Window/SPE_terminal.xaml.cs`

Terminal integrado com:
- Interpretação de comandos personalizados
- Suporte a confirmação Yes/No interativa
- Scroll automático de output
- Visibilidade configurável via `config_page`

### Chat Assistente

**Ficheiros:** `Chat/RasaChatControl.xaml.cs`, `Chat/ChatModels.cs`

Assistente de chat integrado com:
- **Motor local de intents** (`LocalChatEngine`) — funciona offline
- Motor de padrões com regex e prioridades
- Respostas pré-definidas carregadas/guardadas em JSON
- **Text-to-Speech (TTS)** via `System.Speech.Synthesis`
- **Reconhecimento de voz** via `System.Speech.Recognition` (cultura `en-US`)
- Seleção de voz TTS
- Mensagens com bolhas coloridas (user: azul, bot: escuro, sistema: cinza)
- Suporte a imagens nas mensagens
- Timeout de 5 segundos para comunicação HTTP

### Configurações

**Ficheiro:** `Pages/config_page.xaml.cs`

Página de configurações persistentes:

| Opção                   | Propriedade                          | Descrição                                           |
|-------------------------|--------------------------------------|-----------------------------------------------------|
| Terminal                | `TerminalButtonChecked`              | Mostra/oculta o botão de terminal                   |
| Relatório PDF           | `PdfReportEnabled`                   | Ativa/desativa relatórios de conversão PDF          |
| Memória da Aplicação    | `MemoryAppEnabled`                   | Persiste estado entre sessões                       |
| Memória de Moedas       | `CurrencyAppMemoryEnabled`           | Persiste configuração de moedas                     |
| Intro/Loading Screen    | `ShowIntroEnabled`                   | Mostra animação de introdução no arranque           |

Todas as configurações são guardadas via `Properties.Settings.Default.Save()`.

---

## Sistema de Temas

**Ficheiro:** `Themes/ThemesController.cs`

A aplicação suporta 4 temas visuais, geridos por `ResourceDictionary`:

| Tema              | Ficheiro                  | Uid |
|-------------------|---------------------------|-----|
| Light             | `LightTheme.xaml`         | 0   |
| Colourful Light   | `ColourfulLightTheme.xaml`| 1   |
| Dark (padrão)     | `DarkTheme.xaml`          | 2   |
| Colourful Dark    | `ColourfulDarkTheme.xaml` | 3   |

A troca de tema é feita em runtime substituindo o `MergedDictionaries[0]` do `Application.Resources`. O tema padrão é **Dark**.

---

## Sistema de Áudio

**Classe:** `MainWindowHome.AppAudioManager`

Gestor centralizado de áudio da aplicação:
- Aplica volume da app a instâncias `WaveOutEvent` (NAudio)
- Calcula volume efetivo combinando volume original com volume da app
- Verifica estado de mute antes de reproduzir sons
- Subscreve eventos de alteração de volume para atualização em tempo real

A reprodução de áudio usa **NAudio** (`WaveOutEvent`, `AudioFileReader`).

---

## Painel de Controlo de Internet

**Ficheiro:** `Pop_ups/InternetControlPanel.xaml.cs`

Pop-up que aparece ao clicar no ícone de estado de internet:
- Bloqueia/desbloqueia acesso à internet para a app (via proxy inválido `127.0.0.1:65000`)
- Acesso rápido às definições de rede do Windows (`ms-settings:network-wifi`)
- Fecha automaticamente com animação ao perder o foco ou quando o rato sai

A verificação de internet é feita periodicamente (cada 5 segundos) e também reage a alterações de rede (`NetworkChange.NetworkAddressChanged`).

---

## Painel de Controlo de Som

**Ficheiro:** `Pop_ups/SoundControlPanel.xaml.cs`

Pop-up para controlo de volume:
- Controlo de volume do sistema via **Core Audio API** (COM Interop)
- Interfaces: `IMMDeviceEnumerator`, `IMMDevice`, `IAudioEndpointVolume`
- Volume da aplicação independente do sistema
- Evento `AppVolumeChanged` para notificação de alterações
- Funções estáticas: `GetEffectiveAppVolume()`, `IsAppMuted()`

---

## Deteção de Localização

**Classe:** `LocationHelper` (referenciada em `MainWindowPage` e `MainWindowHome`)

- Deteção automática de localização via APIs de geolocalização por IP
- Cache de localização (`IsLocationCached`)
- Timer automático a cada 5 minutos (`MainWindowHome.StartGpsCheck()`)
- Deteção inicial com atraso de 3 segundos após arranque da UI

---

## Ecrã de Introdução e Loading

### LoadingScreen

**Ficheiro:** `Window/LoadingScreen.xaml.cs`

- Janela topmost exibida durante 7 segundos
- Timer `Windows.Forms.Timer` para transição
- Após o timer, esconde-se e abre `Intro_Toast` em modo diálogo

### Intro_Toast

**Ficheiro:** `Window/Intro_Toast.xaml.cs`

Animação de introdução elaborada:
1. **Logo** — fade-in + bounce com `BounceEase`
2. **Texto** — fade-in com atraso de 400ms
3. **Explosão visual** — `ScaleTransform` animada de 1x para 2.5x
4. **Som de explosão** — reproduzido via NAudio (`WaveOutEvent` + `AudioFileReader`)

---

## Diálogo de Desenvolvedor

**Ficheiro:** `dev_dialog.xaml.cs`

Diálogo secreto acessível via atalho `Alt+Ctrl+Shift+F10`. Reproduz um som de alerta ao abrir.

---

## SPE Helper

**Ficheiro:** `Utilities/SPEHelperClient.cs`

Serviço auxiliar externo que comunica via **Named Pipes** (`SPE.Helper.Pipe`):
- Tentativa de localização em `%ProgramFiles%\GreenToastSoftware\SPE.Helper\SPE.Helper.exe`
- Fallback para `%ProgramFiles(x86)%`
- Ping via pipe para verificar disponibilidade
- Timeout de 5 segundos para arranque do serviço

---

## Instalador MSI

**Ficheiro:** `Installer/build-msi.ps1`

Script PowerShell para gerar o instalador MSI:
1. Verifica pré-requisitos (**WiX Toolset v4**)
2. Compila o projeto em modo Release via MSBuild
3. Localiza MSBuild via `vswhere.exe`
4. Gera o ficheiro `SPE_5.0_Setup.msi`

**Uso:**
```powershell
powershell -ExecutionPolicy Bypass -File .\Installer\build-msi.ps1
```

---

## Dependências (NuGet)

| Pacote                               | Versão       | Utilização                                      |
|--------------------------------------|--------------|--------------------------------------------------|
| NAudio (+ módulos)                   | 2.2.1        | Reprodução e gestão de áudio                     |
| Newtonsoft.Json                      | 13.0.3       | Serialização/desserialização JSON                |
| Microsoft.Web.WebView2              | 1.0.3351.48  | Navegador web embebido (Entretenimento)          |
| LiveCharts + LiveCharts.Wpf         | 0.9.7        | Gráficos (conversor de moedas)                   |
| QRCoder                             | 1.6.0        | Geração de QR Codes                             |
| Spire.PDF                           | 11.7.10      | Manipulação e conversão de PDF                   |
| Ookii.Dialogs.Wpf                   | 5.0.1        | Diálogos nativos do Windows (seleção de ficheiros)|
| Microsoft.Office.Interop.Word       | 15.0.4797    | Conversão Word ? PDF                             |
| Microsoft.Office.Interop.PowerPoint | 15.0.4420    | Conversão PowerPoint ? PDF                       |
| LibreHardwareMonitorLib             | 0.9.4        | Monitorização de hardware                        |
| Extended.Wpf.Toolkit               | 4.7.x        | Controlos WPF avançados                          |
| HarfBuzzSharp                       | 8.3.0.1      | Rendering de texto avançado                      |
| ToggleSwitch                        | 1.2.0        | Controlo toggle switch para UI                   |
| System.Management                   | 9.0.0        | Acesso a WMI (drivers, hardware)                 |
| System.Speech (Framework)           | —            | Text-to-Speech e reconhecimento de voz           |
| PresentationFramework.Aero2        | 1.0.1        | Estilos visuais Aero2                            |

---

## Atalhos de Teclado

| Atalho                      | Ação                                |
|-----------------------------|--------------------------------------|
| `Ctrl + Shift + G`          | Abrir/fechar chat assistente         |
| `Alt + Ctrl + Shift + F10`  | Abrir diálogo de desenvolvedor       |

---

## Requisitos do Sistema

- **Sistema Operativo:** Windows 10 ou superior
- **Framework:** .NET Framework 4.8
- **Privilégios:** Administrador (elevação automática ao arranque)
- **Dependências opcionais:**
  - Microsoft Office (Word/PowerPoint) — para conversão de documentos PDF
  - Winget e/ou Chocolatey — para o SPE Installer
  - WebView2 Runtime — para funcionalidades de entretenimento
  - SPE.Helper — serviço auxiliar para operações avançadas

---

## Notas Técnicas

### MSIX / Empacotamento
A aplicação deteta se está a correr como app empacotada (MSIX) via `PackageIdentityHelper.IsPackagedApp()`, que usa a API `GetCurrentPackageFullName`. Em modo empacotado, a elevação de privilégios é ignorada.

### Tray Icon
A aplicação cria um `NotifyIcon` (system tray) para notificações, nomeadamente sobre o estado da conexão à internet.

### Gestão de Exceções
Dois handlers globais capturam exceções não tratadas:
- `AppDomain.CurrentDomain.UnhandledException` — exceções de domínio
- `DispatcherUnhandledException` — exceções na thread da UI (marcadas como `Handled`)

---

*Documentação gerada para SPE 5.0 — GreenToastSoftware Corporation*
