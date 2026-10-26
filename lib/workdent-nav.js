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
        const roleLabel = (session.profession || session.role || 'dentist').replace('_', ' ').toUpperCase();
        const avatarUrl = session.avatar_url;
        const avatarHtml = avatarUrl 
          ? `<img src="${avatarUrl}" alt="${displayName}" class="wd-avatar-img">`
          : `<span class="wd-avatar-initial">${initial}</span>`;

        container.innerHTML = `
          <div class="wd-user-dropdown-wrap" id="wd-user-dropdown-wrap">
            <button type="button" class="wd-user-avatar-btn" id="wd-avatar-btn" onclick="window.toggleWorkdentUserMenu(event, this)" aria-expanded="false" aria-label="Open user menu">
              ${avatarHtml}
              <span class="wd-avatar-name hidden lg:inline-block">${displayName}</span>
              <svg class="size-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
              </svg>
            </button>

            <!-- Google-Style User Profile & Account Dropdown -->
            <div class="wd-user-menu-card" id="wd-user-menu-card" role="menu">
              <div class="wd-user-header">
                <div class="flex items-center gap-3">
                  ${avatarUrl ? `<img src="${avatarUrl}" alt="${displayName}" class="size-11 rounded-full object-cover border border-slate-200">` : `<div class="size-11 rounded-full bg-gradient-to-tr from-teal-600 to-blue-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">${initial}</div>`}
                  <div class="min-w-0 flex-1">
                    <p class="font-extrabold text-sm text-slate-900 truncate m-0">${displayName}</p>
                    <p class="text-xs text-slate-500 truncate m-0 mt-0.5">${session.email}</p>
                    <span class="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">${roleLabel}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-1 py-1">
                <a href="/profile" class="wd-user-item" role="menuitem">
                  <svg class="size-4 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg>
                  <span>My Profile &amp; Portfolio</span>
                </a>
                <a href="/dashboard" class="wd-user-item" role="menuitem">
                  <svg class="size-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"></path></svg>
                  <span>Work &amp; Cases Dashboard</span>
                </a>
                <a href="/cases/new" class="wd-user-item" role="menuitem">
                  <svg class="size-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                  <span>Post / Upload Dental Case</span>
                </a>
                <a href="/onboarding" class="wd-user-item" role="menuitem">
                  <svg class="size-4 text-cyan-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"></path></svg>
                  <span>Edit Profile &amp; Location</span>
                </a>
              </div>

              <div class="my-1 border-t border-slate-100"></div>

              <div class="space-y-1 pt-1">
                <button type="button" onclick="window.WorkDentAuth.logout()" class="wd-user-item" role="menuitem">
                  <svg class="size-4 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"></path></svg>
                  <span>Sign Out</span>
                </button>
                <button type="button" onclick="window.WorkDentAuth.deleteAccount()" class="wd-user-item danger" role="menuitem">
                  <svg class="size-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
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
        const initial = displayName.charAt(0).toUpperCase();
        const roleLabel = (session.profession || session.role || 'dentist').replace('_', ' ').toUpperCase();
        const avatarUrl = session.avatar_url;

        slot.innerHTML = `
          <div class="flex flex-col gap-2 pt-2 border-t border-slate-200">
            <div class="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              ${avatarUrl ? `<img src="${avatarUrl}" alt="${displayName}" class="size-9 rounded-full object-cover">` : `<div class="size-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">${initial}</div>`}
              <div class="flex-1 truncate">
                <div class="text-xs font-bold text-slate-900 truncate">${displayName}</div>
                <div class="text-[10px] text-slate-500 truncate">${session.email}</div>
                <span class="inline-block mt-0.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">${roleLabel}</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-1">
              <a href="/profile" class="wd-btn-secondary text-center text-xs py-2">My Profile</a>
              <a href="/dashboard" class="wd-btn-primary text-center text-xs py-2">Dashboard</a>
            </div>
            <a href="/cases/new" class="text-xs text-teal-700 font-bold py-1 px-1 text-center hover:underline">+ Post Dental Case</a>
            <a href="/onboarding" class="text-xs text-slate-600 font-medium py-0.5 px-1 text-center hover:underline">Edit Profile &amp; Location</a>
            <div class="flex items-center justify-between pt-1 border-t border-slate-100">
              <button type="button" onclick="window.WorkDentAuth.logout()" class="text-xs text-slate-600 font-bold py-1 hover:text-red-600">Sign Out</button>
              <button type="button" onclick="window.WorkDentAuth.deleteAccount()" class="text-xs text-red-600 font-bold py-1 hover:underline">Delete Account</button>
            </div>
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

  // User menu toggle helper
  window.toggleWorkdentUserMenu = function (e, triggerBtn) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const wrap = triggerBtn ? triggerBtn.closest('.wd-user-dropdown-wrap') : document.getElementById('wd-user-dropdown-wrap');
    if (!wrap) return;

    const isOpen = wrap.classList.contains('open');
    document.querySelectorAll('.wd-user-dropdown-wrap').forEach(w => w.classList.remove('open'));
    wrap.classList.toggle('open', !isOpen);
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', String(!isOpen));
  };

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
      document.querySelectorAll('.wd-user-dropdown-wrap').forEach(w => {
        w.classList.remove('open');
        const b = w.querySelector('.wd-user-avatar-btn');
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
        document.querySelectorAll('.wd-user-dropdown-wrap').forEach(w => {
          w.classList.remove('open');
          const b = w.querySelector('.wd-user-avatar-btn');
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

  // ==================== MOBILE BOTTOM NAVIGATION DOCK ====================
  function initBottomNav() {
    let bottomNav = document.getElementById('wd-bottom-nav');
    if (!bottomNav) {
      bottomNav = document.createElement('nav');
      bottomNav.id = 'wd-bottom-nav';
      bottomNav.className = 'wd-bottom-nav';
      bottomNav.setAttribute('aria-label', 'Mobile Navigation');
      document.body.appendChild(bottomNav);
      document.body.classList.add('has-bottom-nav');
    }

    const session = window.WorkDentAuth ? window.WorkDentAuth.validateSession() : null;
    const path = (window.location.pathname || '').toLowerCase();

    const isHome = path === '/' || path === '/index.html' || path === '';
    const isCommunity = path.startsWith('/community');
    const isFind = path.startsWith('/find-designers') || path.startsWith('/jobs') || path.startsWith('/designers') || path.startsWith('/marketplace') || path.startsWith('/gallery');
    const isCreate = path.startsWith('/cases/new') || path.startsWith('/projects/new');
    const isProfile = path.startsWith('/profile') || path.startsWith('/dashboard') || path.startsWith('/auth') || path.startsWith('/onboarding') || path.startsWith('/projects');

    let profileHref = '/auth/login';
    let profileLabel = 'Sign In';
    let profileIconHtml = `
      <svg class="wd-bottom-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
      </svg>
    `;

    if (session && session.email) {
      profileHref = '/profile';
      profileLabel = 'Profile';
      if (session.avatar_url) {
        profileIconHtml = `<img src="${session.avatar_url}" alt="Profile" class="wd-bottom-avatar">`;
      } else {
        const initial = (session.name || session.email).charAt(0).toUpperCase();
        profileIconHtml = `<span class="wd-bottom-initial">${initial}</span>`;
      }
    }

    bottomNav.innerHTML = `
      <div class="wd-bottom-nav-inner">
        <a href="/" class="wd-bottom-item ${isHome ? 'active' : ''}" aria-label="Home" ${isHome ? 'aria-current="page"' : ''}>
          <svg class="wd-bottom-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
          </svg>
          <span class="wd-bottom-label">Home</span>
        </a>

        <a href="/community" class="wd-bottom-item ${isCommunity ? 'active' : ''}" aria-label="Community" ${isCommunity ? 'aria-current="page"' : ''}>
          <svg class="wd-bottom-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
          </svg>
          <span class="wd-bottom-label">Community</span>
        </a>

        <a href="/find-designers" class="wd-bottom-item ${isFind ? 'active' : ''}" aria-label="Find Designers & Jobs" ${isFind ? 'aria-current="page"' : ''}>
          <svg class="wd-bottom-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
          </svg>
          <span class="wd-bottom-label">Find</span>
        </a>

        <a href="/cases/new" class="wd-bottom-item wd-bottom-create ${isCreate ? 'active' : ''}" aria-label="Post Dental Case" ${isCreate ? 'aria-current="page"' : ''}>
          <div class="wd-bottom-create-btn" title="Post New Dental Case">
            <svg class="size-6 text-white" fill="none" stroke="currentColor" stroke-width="2.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
            </svg>
          </div>
          <span class="wd-bottom-label">Create</span>
        </a>

        <a href="${profileHref}" class="wd-bottom-item ${isProfile ? 'active' : ''}" aria-label="${profileLabel}" ${isProfile ? 'aria-current="page"' : ''}>
          ${profileIconHtml}
          <span class="wd-bottom-label">${profileLabel}</span>
        </a>
      </div>
    `;
  }

  // Initialize immediately or on DOMContentLoaded
  function initAll() {
    initScrollNavbar();
    initDesktopDotsMenu();
    initMobileDrawer();
    initHeaderAuth();
    initCookieNotice();
    initBottomNav();
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
      initBottomNav();
    }
  });

  window.addEventListener('workdent:auth-changed', () => {
    initHeaderAuth();
    initBottomNav();
  });

  window.WorkDentNav = {
    refreshAuth: () => {
      initHeaderAuth();
      initBottomNav();
    },
    toggleMoreMenu: window.toggleWorkdentMoreMenu,
    toggleMobileNav: window.toggleWorkdentMobileNav,
    closeMobileNav: window.closeWorkdentMobileNav
  };
})();
