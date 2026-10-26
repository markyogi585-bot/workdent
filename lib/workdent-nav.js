/**
 * WorkDent Global Navigation, 3-Dot Menus & Session Synchronizer
 * Features:
 * - 3-Dot Desktop "More" dropdown
 * - 3-Dot Mobile & Tablet drawer with reliable touch/click toggle
 * - Dynamic signed-in session display (user avatar, role, 1-click logout)
 * - 3-Day Persistent Cookie notice bar
 */

(function () {
  'use strict';

  function initHeaderAuth() {
    const session = window.WorkDentAuth ? window.WorkDentAuth.validateSession() : null;
    const authContainers = document.querySelectorAll('.wd-auth-slot');

    authContainers.forEach((container) => {
      if (session && session.email) {
        const displayName = session.name || session.email.split('@')[0];
        const initial = displayName.charAt(0).toUpperCase();
        const roleLabel = (session.role || 'dentist').toUpperCase();
        const isVip = session.isVip || session.role === 'vip';
        
        container.innerHTML = `
          <div class="flex items-center gap-2">
            <a href="/profile" class="wd-user-pill" title="View Profile">
              <span class="size-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">${initial}</span>
              <span class="max-w-[120px] truncate font-bold">${displayName}</span>
              ${isVip ? '<span class="text-xs">⭐</span>' : ''}
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-black">${roleLabel}</span>
            </a>
            <button type="button" onclick="window.WorkDentAuth.logout()" class="px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Sign Out">
              Sign Out
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="flex items-center gap-2">
            <a href="/auth/login" class="wd-nav-link">Sign In</a>
            <a href="/auth/register" class="wd-btn-primary" style="padding: 0.5rem 1rem; min-height: 40px; font-size: 0.875rem;">
              <span>Join Free</span>
              <svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
              </svg>
            </a>
          </div>
        `;
      }
    });

    // Also update mobile drawer auth slot if present
    const mobileAuthSlots = document.querySelectorAll('.wd-mobile-auth-slot');
    mobileAuthSlots.forEach((slot) => {
      if (session && session.email) {
        const displayName = session.name || session.email.split('@')[0];
        slot.innerHTML = `
          <div class="flex flex-col gap-2 pt-2 border-t border-slate-200">
            <div class="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-lg">
              <div class="size-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">${displayName.charAt(0).toUpperCase()}</div>
              <div class="flex-1 truncate">
                <div class="text-xs font-bold text-slate-900 truncate">${displayName}</div>
                <div class="text-[10px] text-slate-500">${session.email} &bull; ${(session.role || 'dentist').toUpperCase()}</div>
              </div>
            </div>
            <a href="/profile" class="wd-btn-secondary text-center text-xs py-2">My Profile & Portfolio</a>
            <button type="button" onclick="window.WorkDentAuth.logout()" class="text-xs text-red-600 font-bold py-1.5 text-center hover:underline">Sign Out</button>
          </div>
        `;
      } else {
        slot.innerHTML = `
          <div class="flex gap-2 pt-3 border-t border-slate-200 mt-2">
            <a href="/auth/login" class="wd-btn-secondary flex-1 text-center text-xs py-2">Sign In</a>
            <a href="/auth/register" class="wd-btn-primary flex-1 text-center text-xs py-2">Join Free</a>
          </div>
        `;
      }
    });
  }

  // ==================== 3-DOT DESKTOP "MORE" MENU ====================
  function initDesktopDotsMenu() {
    const moreWraps = document.querySelectorAll('.wd-more-dropdown');
    moreWraps.forEach((wrap) => {
      const btn = wrap.querySelector('.wd-dots-btn') || wrap.querySelector('button');
      if (!btn) return;

      if (btn._dotsInitialized) return;
      btn._dotsInitialized = true;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.toggleWorkdentMoreMenu(e, btn);
      });

      const content = wrap.querySelector('.wd-dropdown-content');
      if (content) {
        content.addEventListener('click', (e) => {
          if (!e.target.closest('a')) {
            e.stopPropagation();
          } else {
            wrap.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });

    document.addEventListener('click', () => {
      moreWraps.forEach(w => {
        w.classList.remove('open');
        const b = w.querySelector('.wd-dots-btn') || w.querySelector('button');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        moreWraps.forEach(w => {
          w.classList.remove('open');
          const b = w.querySelector('.wd-dots-btn') || w.querySelector('button');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  window.toggleWorkdentMoreMenu = function (e, triggerBtn) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const btn = triggerBtn || e?.currentTarget;
    const wrap = btn?.closest('.wd-more-dropdown') || document.querySelector('.wd-more-dropdown');
    if (!wrap) return;

    const isOpen = wrap.classList.contains('open');
    document.querySelectorAll('.wd-more-dropdown').forEach(w => w !== wrap && w.classList.remove('open'));
    wrap.classList.toggle('open', !isOpen);
    if (btn) btn.setAttribute('aria-expanded', String(!isOpen));
  };

  // ==================== 3-DOT MOBILE & TABLET DRAWER ====================
  function updateMobileToggleIcon(toggle, isOpen) {
    const svg = toggle.querySelector('svg');
    if (!svg) return;

    if (isOpen) {
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12"></path>
      `;
    } else {
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'currentColor');
      svg.removeAttribute('stroke');
      svg.innerHTML = `
        <circle cx="5" cy="12" r="2.2"></circle>
        <circle cx="12" cy="12" r="2.2"></circle>
        <circle cx="19" cy="12" r="2.2"></circle>
      `;
    }
  }

  function initMobileDrawer() {
    const toggles = document.querySelectorAll('#wd-mobile-toggle, #wd-mobile-toggle-btn, .wd-mobile-toggle');
    const drawers = document.querySelectorAll('#wd-mobile-drawer, .wd-mobile-drawer');
    if (!toggles.length || !drawers.length) return;

    toggles.forEach(toggle => {
      if (toggle._mobileInit) return;
      toggle._mobileInit = true;

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.toggleWorkdentMobileNav(e, toggle);
      });
    });

    drawers.forEach(drawer => {
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          window.closeWorkdentMobileNav();
        });
      });

      drawer.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });

    document.addEventListener('click', (e) => {
      let isInsideAny = false;
      toggles.forEach(t => { if (t.contains(e.target)) isInsideAny = true; });
      drawers.forEach(d => { if (d.contains(e.target)) isInsideAny = true; });
      if (!isInsideAny) {
        window.closeWorkdentMobileNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeWorkdentMobileNav();
      }
    });
  }

  window.toggleWorkdentMobileNav = function (e, triggerBtn) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const drawer = document.getElementById('wd-mobile-drawer') || document.querySelector('.wd-mobile-drawer');
    const toggle = triggerBtn || document.getElementById('wd-mobile-toggle') || document.getElementById('wd-mobile-toggle-btn') || document.querySelector('.wd-mobile-toggle');
    if (!drawer) return;

    const isOpen = drawer.classList.contains('active');
    drawer.classList.toggle('active', !isOpen);

    if (toggle) {
      toggle.setAttribute('aria-expanded', String(!isOpen));
      updateMobileToggleIcon(toggle, !isOpen);
    }
  };

  window.closeWorkdentMobileNav = function () {
    const drawers = document.querySelectorAll('#wd-mobile-drawer, .wd-mobile-drawer');
    drawers.forEach(d => d.classList.remove('active'));

    const toggles = document.querySelectorAll('#wd-mobile-toggle, #wd-mobile-toggle-btn, .wd-mobile-toggle');
    toggles.forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      updateMobileToggleIcon(t, false);
    });
  };

  // ==================== COOKIE NOTICE ====================
  function initCookieNotice() {
    const banner = document.getElementById('wd-cookie-notice');
    if (!banner) return;

    const consent = localStorage.getItem('workdent_cookie_consent');
    if (!consent) {
      banner.classList.remove('hidden');
    }

    const acceptBtn = document.getElementById('wd-cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('workdent_cookie_consent', 'accepted');
        banner.classList.add('hidden');
      });
    }

    const dismissBtn = document.getElementById('wd-cookie-dismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        localStorage.setItem('workdent_cookie_consent', 'dismissed');
        banner.classList.add('hidden');
      });
    }
  }

  // ==================== SCROLL NAVBAR ====================
  function initScrollNavbar() {
    const navbar = document.querySelector('.wd-navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 15) {
          navbar.classList.add('wd-navbar-scrolled');
        } else {
          navbar.classList.remove('wd-navbar-scrolled');
        }
      }, { passive: true });
    }
  }

  // Initialize immediately or on DOMContentLoaded
  function initAll() {
    initScrollNavbar();
    initDesktopDotsMenu();
    initMobileDrawer();
    initHeaderAuth();
    initCookieNotice();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Re-check auth if session updates
  window.addEventListener('storage', (e) => {
    if (e.key === 'workdent_auth_session' || e.key === 'workdent_session') {
      initHeaderAuth();
    }
  });

  window.WorkDentNav = {
    refreshAuth: initHeaderAuth,
    toggleMoreMenu: window.toggleWorkdentMoreMenu,
    toggleMobileNav: window.toggleWorkdentMobileNav,
    closeMobileNav: window.closeWorkdentMobileNav
  };
})();
