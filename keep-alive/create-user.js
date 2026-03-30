/**
 * Script para listar users e definir senha do utilizador keepalive.
 * Apagar após uso.
 */
const https = require('https');

const SUPABASE_URL = 'https://fgigiqnvrexvtmqketuh.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaWdpcW52cmV4dnRtcWtldHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQwMzc3NiwiZXhwIjoyMDg3OTc5Nzc2fQ.JP4WPDzVEGjrnQw-Bzm83omnTjvCKynuWbqlt85EcQE';
const TARGET_EMAIL = 'official_greentoastsoftware@outlook.com';
const NEW_PASSWORD = 'GtKeepAlive2026!$Xr9';

function httpsReq(method, path, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(SUPABASE_URL + path);
        const bodyStr = body ? JSON.stringify(body) : null;
        const req = https.request({
            hostname: url.hostname, port: 443,
            path: url.pathname + url.search, method,
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': 'Bearer ' + SERVICE_ROLE_KEY,
                'Content-Type': 'application/json',
                ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {})
            }
        }, res => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
                catch { resolve({ status: res.statusCode, data: d }); }
            });
        });
        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

async function main() {
    console.log('A criar utilizador:', TARGET_EMAIL);
    const result = await httpsReq('POST', '/auth/v1/admin/users', {
        email: TARGET_EMAIL,
        password: NEW_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: 'KeepAlive Bot' }
    });
    
    console.log('Status:', result.status);
    if (result.status === 200 && result.data.id) {
        console.log('\n=== UTILIZADOR CRIADO COM SUCESSO ===');
        console.log('ID:', result.data.id);
        console.log('Email:', result.data.email);
        console.log('Password:', NEW_PASSWORD);
        console.log('\nPode apagar este ficheiro (create-user.js) e testar o keep-alive!');
    } else {
        console.error('Erro:', JSON.stringify(result.data, null, 2));
    }
}

main().catch(err => { console.error('Erro:', err.message); process.exit(1); });
