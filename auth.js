// GreenToastSoftware Authentication System
// Powered by Supabase

// ============================================
// Session Management
// ============================================

/**
 * Ensure session is available - restore from backup if needed
 */
async function ensureSession() {
    // First check if Supabase has a session
    const { data } = await supabaseClient.auth.getSession();
    if (data?.session) {
        console.log('Session available in Supabase');
        return data.session;
    }
    
    // If not, try to restore from backup
    const backupData = sessionStorage.getItem('gt-temp-session');
    if (backupData) {
        try {
            console.log('Restoring session from backup for operation...');
            const sessionData = JSON.parse(backupData);
            const { data: restored, error } = await supabaseClient.auth.setSession({
                access_token: sessionData.access_token,
                refresh_token: sessionData.refresh_token
            });
            if (restored?.session) {
                console.log('Session restored successfully');
                return restored.session;
            }
            if (error) {
                console.error('Error restoring session:', error);
            }
        } catch (e) {
            console.error('Failed to restore session:', e);
        }
    }
    
    console.warn('No session available');
    return null;
}

// ============================================
// Authentication Functions
// ============================================

/**
 * Sign up a new user
 * @param {string} email 
 * @param {string} password 
 * @param {object} metadata - Additional user metadata (name, etc.)
 */
async function signUp(email, password, metadata = {}) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: metadata.fullName || '',
                    avatar_url: metadata.avatarUrl || '',
                    preferences: {
                        theme: 'light',
                        language: 'en',
                        notifications: true
                    }
                }
            }
        });

        if (error) throw error;

        return { success: true, data: data, message: 'Account created! Please check your email to verify.' };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign in an existing user
 * @param {string} email 
 * @param {string} password 
 */
async function signIn(email, password) {
    console.log('=== SIGN IN ATTEMPT ===');
    console.log('Email:', email);
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        console.log('Sign in response:');
        console.log('- Data:', data);
        console.log('- Session:', data?.session);
        console.log('- User:', data?.user?.email);
        console.log('- Error:', error);

        if (error) throw error;

        // Check if session was saved
        setTimeout(() => {
            const savedSession = localStorage.getItem(window.SUPABASE_STORAGE_KEY || 'sb-fgigiqnvrexvtmqketuh-auth-token');
            console.log('Session saved in localStorage:', savedSession ? 'YES (length: ' + savedSession.length + ')' : 'NO');
            console.log('All auth keys:', Object.keys(localStorage).filter(k => k.includes('sb-') || k.includes('auth')));
        }, 500);

        // Store session info
        localStorage.setItem('gt_user_session', JSON.stringify({
            loggedInAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform
        }));

        return { success: true, data: data };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign out the current user
 */
async function signOut() {
    try {
        // Clear session backup on sign out
        sessionStorage.removeItem('gt-temp-session');
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;

        localStorage.removeItem('gt_user_session');
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get the current user
 */
async function getCurrentUser() {
    try {
        // First try to get from session (faster)
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
            return session.user;
        }
        // Fallback to getUser if no session
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

/**
 * Get the current session
 */
async function getSession() {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Get session error:', error);
        return null;
    }
}

/**
 * Send password reset email
 * @param {string} email 
 */
async function resetPassword(email) {
    try {
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/account.html?tab=security`
        });

        if (error) throw error;

        return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update user password
 * @param {string} newPassword 
 */
async function updatePassword(newPassword) {
    try {
        // Ensure session is available before operation
        const session = await ensureSession();
        if (!session) {
            throw new Error('Auth session missing! Please log in again.');
        }

        const { data, error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        return { success: true, message: 'Password updated successfully!' };
    } catch (error) {
        console.error('Update password error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update user profile
 * @param {object} profileData 
 */
async function updateProfile(profileData) {
    try {
        // Ensure session is available before operation
        const session = await ensureSession();
        if (!session) {
            throw new Error('Auth session missing! Please log in again.');
        }

        const { data, error } = await supabaseClient.auth.updateUser({
            data: profileData
        });

        if (error) throw error;

        return { success: true, data: data, message: 'Profile updated successfully!' };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update user email
 * @param {string} newEmail 
 */
async function updateEmail(newEmail) {
    try {
        // Ensure session is available before operation
        const session = await ensureSession();
        if (!session) {
            throw new Error('Auth session missing! Please log in again.');
        }

        const { data, error } = await supabaseClient.auth.updateUser({
            email: newEmail
        });

        if (error) throw error;

        return { success: true, message: 'Verification email sent to your new address!' };
    } catch (error) {
        console.error('Update email error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Upload avatar image
 * @param {File} file 
 */
async function uploadAvatar(file) {
    try {
        // Ensure session is available
        const session = await ensureSession();
        if (!session) {
            throw new Error('Auth session missing! Please log in again.');
        }

        const user = await getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;

        const { data, error: uploadError } = await supabaseClient.storage
            .from('avatares')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type,
                metadata: {
                    'content-type': file.type,
                    'size': file.size.toString()
                }
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseClient.storage
            .from('avatares')
            .getPublicUrl(fileName);

        // Update user profile with avatar URL
        await updateProfile({ avatar_url: publicUrl });

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error('Upload avatar error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user preferences
 */
async function getPreferences() {
    const user = await getCurrentUser();
    if (!user) return null;

    return user.user_metadata?.preferences || {
        theme: 'light',
        language: 'en',
        notifications: true,
        emailUpdates: false
    };
}

/**
 * Update user preferences
 * @param {object} preferences 
 */
async function updatePreferences(preferences) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        const currentMetadata = user.user_metadata || {};
        const updatedPreferences = {
            ...currentMetadata.preferences,
            ...preferences
        };

        const result = await updateProfile({
            ...currentMetadata,
            preferences: updatedPreferences
        });

        return result;
    } catch (error) {
        console.error('Update preferences error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get session history from local storage
 */
function getSessionHistory() {
    try {
        const history = localStorage.getItem('gt_session_history');
        return history ? JSON.parse(history) : [];
    } catch {
        return [];
    }
}

/**
 * Add current session to history
 */
function addSessionToHistory() {
    const history = getSessionHistory();
    const currentSession = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    // Keep only last 10 sessions
    history.unshift(currentSession);
    if (history.length > 10) {
        history.pop();
    }

    localStorage.setItem('gt_session_history', JSON.stringify(history));
    return history;
}

/**
 * Clear session history
 */
function clearSessionHistory() {
    localStorage.removeItem('gt_session_history');
    return [];
}

/**
 * Delete user account
 */
async function deleteAccount() {
    try {
        // Note: Account deletion requires server-side implementation via Supabase Edge Functions
        // This is a placeholder that signs out the user
        await signOut();
        localStorage.clear();
        
        return { 
            success: true, 
            message: 'Please contact support at support@greentoastsoftware.com to complete account deletion.' 
        };
    } catch (error) {
        console.error('Delete account error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Auth State Listener (for navbar only - pages handle their own redirects)
// ============================================

/**
 * Update navbar to show auth state
 */
function updateNavbarAuthState(isLoggedIn, user) {
    const authBtn = document.getElementById('auth-nav-btn');
    const authBtnMobile = document.getElementById('auth-nav-btn-mobile');

    if (authBtn) {
        if (isLoggedIn && user) {
            const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account';
            authBtn.innerHTML = `
                <span class="user-avatar-small">
                    ${user.user_metadata?.avatar_url 
                        ? `<img src="${user.user_metadata.avatar_url}" alt="Avatar">` 
                        : displayName.charAt(0).toUpperCase()}
                </span>
                <span class="user-name">${displayName}</span>
            `;
            authBtn.href = 'account.html';
        } else {
            authBtn.innerHTML = 'Sign In';
            authBtn.href = 'login.html';
        }
    }

    if (authBtnMobile) {
        authBtnMobile.href = isLoggedIn ? 'account.html' : 'login.html';
        authBtnMobile.textContent = isLoggedIn ? 'My Account' : 'Sign In';
    }
}

// Global auth state listener - only updates navbar, doesn't redirect
supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('Global auth state changed:', event);
    
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        addSessionToHistory();
        updateNavbarAuthState(true, session?.user);
    } else if (event === 'SIGNED_OUT') {
        updateNavbarAuthState(false, null);
    }
});

// Check auth state on page load for navbar
document.addEventListener('DOMContentLoaded', async () => {
    const session = await getSession();
    updateNavbarAuthState(!!session, session?.user);
});

// Export functions
window.auth = {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    getSession,
    ensureSession,
    resetPassword,
    updatePassword,
    updateProfile,
    updateEmail,
    uploadAvatar,
    getPreferences,
    updatePreferences,
    getSessionHistory,
    addSessionToHistory,
    clearSessionHistory,
    deleteAccount
};
