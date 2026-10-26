/**
 * WorkDent Supabase Backend Client & Session Engine
 * Features:
 * - 3-Day Persistent Cookie Auth (Max-Age: 259200)
 * - Automatic Expiration & Re-login Handling
 * - Multi-Role Access Control (Dentist, CAD Designer, Lab, Admin)
 * - Email / Password & Passwordless OTP Support
 * - Cases, Projects, Messages & Wallet Sync
 */

(function (window) {
  'use strict';

  // 1. Core Config
  const DEFAULT_CONFIG = {
    supabaseUrl: window.WORKDENT_SUPABASE_URL || 'https://rbaoiaxbgffdbbzdvylh.supabase.co',
    supabaseKey: window.WORKDENT_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_anon_key',
    cookieName: 'workdent_auth_session',
    sessionDays: 3,
    cookieMaxAge: 3 * 24 * 60 * 60 // 259200 seconds = 3 days
  };

  // 2. Cookie Helpers
  const CookieManager = {
    set(name, value, days = 3) {
      const maxAge = days * 24 * 60 * 60;
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; max-age=${maxAge}; expires=${expires}; path=/; SameSite=Lax${secure}`;
    },
    get(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) {
        try {
          return JSON.parse(decodeURIComponent(match[2]));
        } catch (e) {
          return decodeURIComponent(match[2]);
        }
      }
      return null;
    },
    remove(name) {
      document.cookie = `${name}=; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    }
  };

  // 3. Supabase SDK Loader
  let supabaseClientInstance = null;
  function getSupabase() {
    if (supabaseClientInstance) return supabaseClientInstance;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      supabaseClientInstance = window.supabase.createClient(DEFAULT_CONFIG.supabaseUrl, DEFAULT_CONFIG.supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      return supabaseClientInstance;
    }
    return null;
  }

  // Load SDK asynchronously if missing
  function loadSdk() {
    return new Promise((resolve) => {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        resolve(getSupabase());
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.48.1/dist/umd/supabase.js';
      script.onload = () => {
        resolve(getSupabase());
      };
      script.onerror = () => {
        console.warn('Supabase CDN failed to load, falling back to local session store.');
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }

  // 4. Session Validation (Enforces Strict 3-Day Rule)
  function validateSession() {
    const session = CookieManager.get(DEFAULT_CONFIG.cookieName);
    if (!session) return null;

    const createdAt = session.createdAt || 0;
    const now = Date.now();
    const ageMs = now - createdAt;
    const maxAgeMs = DEFAULT_CONFIG.sessionDays * 864e5;

    if (ageMs > maxAgeMs) {
      console.warn('WorkDent session expired (3 days exceeded). Redirecting to login.');
      logout();
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login?expired=true';
      }
      return null;
    }
    return session;
  }

  // 5. Auth API Methods
  async function register({ email, password, firstName, lastName, role = 'dentist' }) {
    await loadSdk();
    const sb = getSupabase();
    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0];

    if (sb && DEFAULT_CONFIG.supabaseKey !== 'placeholder_anon_key') {
      try {
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: fullName,
              role: role
            }
          }
        });
        if (error) throw error;
        
        const sessionPayload = {
          user: data.user,
          email,
          role,
          name: fullName,
          createdAt: Date.now()
        };
        CookieManager.set(DEFAULT_CONFIG.cookieName, sessionPayload, 3);
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Local / Offline fallback with 3-day cookie
    const localUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email,
      name: fullName,
      role,
      createdAt: Date.now()
    };
    CookieManager.set(DEFAULT_CONFIG.cookieName, localUser, 3);
    return { success: true, data: { user: localUser } };
  }

  async function login({ email, password }) {
    await loadSdk();
    const sb = getSupabase();

    if (sb && DEFAULT_CONFIG.supabaseKey !== 'placeholder_anon_key') {
      try {
        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Fetch user profile from public.profiles
        let userRole = data.user.user_metadata?.role || 'dentist';
        const { data: profile } = await sb.from('profiles').select('role, full_name').eq('id', data.user.id).single();
        if (profile) {
          userRole = profile.role || userRole;
        }

        const sessionPayload = {
          user: data.user,
          email: data.user.email,
          role: userRole,
          name: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
          createdAt: Date.now()
        };
        CookieManager.set(DEFAULT_CONFIG.cookieName, sessionPayload, 3);
        return { success: true, data, role: userRole };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Local fallback
    const role = email.includes('designer') ? 'designer' : (email.includes('admin') ? 'admin' : 'dentist');
    const localUser = {
      id: 'usr_active',
      email,
      name: email.split('@')[0],
      role,
      createdAt: Date.now()
    };
    CookieManager.set(DEFAULT_CONFIG.cookieName, localUser, 3);
    return { success: true, role };
  }

  // OTP Methods
  async function sendOtp({ email }) {
    await loadSdk();
    const sb = getSupabase();
    if (sb && DEFAULT_CONFIG.supabaseKey !== 'placeholder_anon_key') {
      try {
        const { data, error } = await sb.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true }
        });
        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    // Simulation
    localStorage.setItem('workdent_pending_otp_email', email);
    return { success: true, message: 'OTP sent to ' + email };
  }

  async function verifyOtp({ email, token }) {
    await loadSdk();
    const sb = getSupabase();
    if (sb && DEFAULT_CONFIG.supabaseKey !== 'placeholder_anon_key') {
      try {
        const { data, error } = await sb.auth.verifyOtp({
          email,
          token,
          type: 'email'
        });
        if (error) throw error;

        const role = data.user?.user_metadata?.role || 'dentist';
        const sessionPayload = {
          user: data.user,
          email,
          role,
          name: data.user?.user_metadata?.full_name || email.split('@')[0],
          createdAt: Date.now()
        };
        CookieManager.set(DEFAULT_CONFIG.cookieName, sessionPayload, 3);
        return { success: true, data, role };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Local OTP verification
    const role = 'dentist';
    const localUser = {
      id: 'usr_otp',
      email,
      name: email.split('@')[0],
      role,
      createdAt: Date.now()
    };
    CookieManager.set(DEFAULT_CONFIG.cookieName, localUser, 3);
    return { success: true, role };
  }

  function logout() {
    const sb = getSupabase();
    if (sb) {
      try { sb.auth.signOut(); } catch (e) {}
    }
    CookieManager.remove(DEFAULT_CONFIG.cookieName);
    localStorage.removeItem('workdent_session');
    window.location.href = '/auth/login';
  }

  // Role Redirection Helper
  function getDashboardUrl(role) {
    switch (role) {
      case 'designer':
        return '/designer/dashboard';
      case 'admin':
        return '/admin';
      case 'lab':
      case 'dentist':
      default:
        return '/dashboard';
    }
  }

  // Auth Guard for Protected Pages
  function requireAuth(allowedRoles = []) {
    const session = validateSession();
    if (!session) {
      const redirect = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth/login?redirect=${redirect}`;
      return false;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
      alert(`Access denied. This portal requires: ${allowedRoles.join(' or ')}.`);
      window.location.href = getDashboardUrl(session.role);
      return false;
    }
    return session;
  }

  // Expose global WorkDentAuth object
  window.WorkDentAuth = {
    config: DEFAULT_CONFIG,
    init: loadSdk,
    register,
    login,
    sendOtp,
    verifyOtp,
    logout,
    validateSession,
    requireAuth,
    getDashboardUrl,
    Cookie: CookieManager
  };

  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSdk);
  } else {
    loadSdk();
  }

})(window);
