// Supabase Configuration
// GreenToastSoftware Account System

console.log('=== SUPABASE CONFIG LOADING ===');

const SUPABASE_URL = 'https://fgigiqnvrexvtmqketuh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaWdpcW52cmV4dnRtcWtldHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDM3NzYsImV4cCI6MjA4Nzk3OTc3Nn0.y3O8aTnz6VhQJl0--TNoev9Yhle_bx83MGq15dOxn0I';

// Default storage key used by Supabase
const STORAGE_KEY = 'sb-fgigiqnvrexvtmqketuh-auth-token';

// Check if Supabase library is loaded
if (typeof supabase === 'undefined') {
    console.error('ERROR: Supabase library not loaded! Make sure the CDN script is included before this file.');
    alert('Erro: Biblioteca Supabase não carregada. Verifique sua conexão de internet.');
} else {
    console.log('Supabase library found, creating client...');
}

// Custom storage using sessionStorage (localStorage not persisting in this environment)
const customStorage = {
    getItem: (key) => {
        const value = sessionStorage.getItem(key);
        console.log('Storage GET:', key, value ? 'found' : 'not found');
        return value;
    },
    setItem: (key, value) => {
        console.log('Storage SET:', key);
        sessionStorage.setItem(key, value);
    },
    removeItem: (key) => {
        console.log('Storage REMOVE:', key);
        sessionStorage.removeItem(key);
    }
};

// Initialize Supabase client with sessionStorage
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: customStorage,
        storageKey: STORAGE_KEY,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

console.log('Supabase client created successfully with sessionStorage');

// Export for use in other scripts
window.supabaseClient = supabaseClient;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_STORAGE_KEY = STORAGE_KEY;

// Debug: Log storage on load
const storedSession = sessionStorage.getItem(STORAGE_KEY);
console.log('Session in storage (' + STORAGE_KEY + '):', storedSession ? 'EXISTS (length: ' + storedSession.length + ')' : 'NONE');

// Also show all supabase-related keys
console.log('All sessionStorage keys:', Object.keys(sessionStorage).filter(k => k.includes('sb-') || k.includes('supabase') || k.includes('auth') || k.includes('gt-')));
