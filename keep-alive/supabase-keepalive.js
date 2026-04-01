/**
 * Supabase Keep-Alive Script
 * GreenToastSoftware
 * 
 * Faz login e logout automático numa conta admin do Supabase
 * para evitar que o projeto fique inativo (pausa após ~7 dias no plano gratuito).
 * 
 * Configurado para correr a cada 3 dias via Windows Task Scheduler.
 * Sem dependências externas — usa apenas módulos nativos do Node.js.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Carregar configuração ───
const configPath = path.join(__dirname, 'config.json');
const logPath = path.join(__dirname, 'keepalive.log');

let config;
try {
    const raw = fs.readFileSync(configPath, 'utf-8').replace(/^\uFEFF/, ''); // Remove BOM
    config = JSON.parse(raw);
} catch (err) {
    logMessage('ERRO: Não foi possível ler config.json — ' + err.message);
    process.exit(1);
}

const { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } = config;

if (!ADMIN_EMAIL || ADMIN_EMAIL === 'SEU_EMAIL_ADMIN_AQUI') {
    logMessage('ERRO: Configure o ADMIN_EMAIL e ADMIN_PASSWORD no ficheiro config.json');
    process.exit(1);
}

// ─── Utilidades ───

function logMessage(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}`;
    console.log(line);
    try {
        fs.appendFileSync(logPath, line + '\n', 'utf-8');
    } catch (_) { /* ignora erros de escrita no log */ }
}

function httpsRequest(url, options, body) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error('Request timeout (30s)'));
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

// ─── Keep-Alive: Login → Query → Logout ───

async function keepAlive() {
    logMessage('========================================');
    logMessage('Supabase Keep-Alive iniciado');
    logMessage('URL: ' + SUPABASE_URL);
    logMessage('Email: ' + ADMIN_EMAIL);

    let accessToken = null;

    // PASSO 1: Login
    try {
        logMessage('PASSO 1: A fazer login...');
        const loginResult = await httpsRequest(
            `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                }
            },
            { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
        );

        if (loginResult.status === 200 && loginResult.data.access_token) {
            accessToken = loginResult.data.access_token;
            logMessage('Login OK — sessão obtida (user: ' + (loginResult.data.user?.id || 'n/a') + ')');
        } else {
            logMessage('ERRO no login — HTTP ' + loginResult.status + ': ' + JSON.stringify(loginResult.data));
            process.exit(1);
        }
    } catch (err) {
        logMessage('ERRO no login — ' + err.message);
        process.exit(1);
    }

    // PASSO 2: Ping à base de dados (health check via REST API)
    try {
        logMessage('PASSO 2: Ping à base de dados...');
        const pingResult = await httpsRequest(
            `${SUPABASE_URL}/rest/v1/`,
            {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        );
        logMessage('Ping DB OK — HTTP ' + pingResult.status);
    } catch (err) {
        logMessage('AVISO: Ping DB falhou — ' + err.message + ' (continuando...)');
    }

    // PASSO 3: Ping ao Storage (mantém bucket ativo)
    try {
        logMessage('PASSO 3: Ping ao Storage...');
        const storageResult = await httpsRequest(
            `${SUPABASE_URL}/storage/v1/bucket`,
            {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        );
        logMessage('Ping Storage OK — HTTP ' + storageResult.status);
    } catch (err) {
        logMessage('AVISO: Ping Storage falhou — ' + err.message + ' (continuando...)');
    }

    // PASSO 4: Logout
    try {
        logMessage('PASSO 4: A fazer logout...');
        const logoutResult = await httpsRequest(
            `${SUPABASE_URL}/auth/v1/logout`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }
            }
        );
        logMessage('Logout OK — HTTP ' + logoutResult.status);
    } catch (err) {
        logMessage('AVISO: Logout falhou — ' + err.message);
    }

    logMessage('Keep-Alive concluído com sucesso!');
    logMessage('Próxima execução: em ~3 dias');
    logMessage('========================================');
}

// ─── Executar ───
keepAlive().catch(err => {
    logMessage('ERRO FATAL: ' + err.message);
    process.exit(1);
});
