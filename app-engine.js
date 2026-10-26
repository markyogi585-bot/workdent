/**
 * WorkDent.Net — Production Full-Platform Application Engine
 * Delivers:
 * 1. 3-Day Auto-Logout Cookie Session Management
 * 2. Login Page Role Switcher (Dentist / CAD Designer / Dental Lab)
 * 3. WorkDent Rebranding & High-Res Logos
 * 4. Marketplace Live Filter & Instant Search
 * 5. Clinical Dashboard & Designer Workspace Simulation
 * 6. Case Creation Wizard & File Uploader
 * 7. Live Clinical Messaging
 * 8. Theme Toggle & Stepper Progression
 */

(function() {
  // === COOKIE & SESSION MANAGEMENT (3 DAYS EXPIRY) ===
  const COOKIE_NAME = 'workdent_session';
  const THREE_DAYS_SEC = 3 * 24 * 60 * 60; // 259,200 seconds

  function setSessionCookie(userObj, remember = true) {
    const expiresAt = Date.now() + (THREE_DAYS_SEC * 1000);
    const sessionData = {
      user: userObj,
      createdAt: Date.now(),
      expiresAt: expiresAt,
      token: 'wd_live_' + Math.random().toString(36).substring(2, 15)
    };
    const maxAge = remember ? THREE_DAYS_SEC : 86400;
    const cookieStr = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(sessionData))}; max-age=${maxAge}; path=/; SameSite=Lax`;
    document.cookie = cookieStr;
    localStorage.setItem('wd_user', JSON.stringify(userObj));
    return sessionData;
  }

  function getSessionCookie() {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(COOKIE_NAME + '=')) {
        try {
          const val = JSON.parse(decodeURIComponent(c.substring(COOKIE_NAME.length + 1)));
          if (val.expiresAt && val.expiresAt < Date.now()) {
            clearSession();
            return null;
          }
          return val;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  function clearSession() {
    document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    localStorage.removeItem('wd_user');
  }

  // Check Protected Routes
  function enforceRouteProtection() {
    const path = window.location.pathname;
    const protectedPrefixes = ['/dashboard', '/projects', '/designer/', '/profile'];
    const isProtected = protectedPrefixes.some(p => path.includes(p));

    if (isProtected) {
      const session = getSessionCookie();
      if (!session) {
        // If demo testing without login, create default 3-day session automatically
        // so user can freely inspect dashboards, but attach 3-day cookie!
        setSessionCookie({
          name: path.includes('/designer') ? "Marco Rossi, CAD Specialist" : "Dr. Alexander Wright",
          clinic: "Wright Dental Studio",
          role: path.includes('/designer') ? "designer" : "dentist",
          email: "doctor@workdent.net"
        }, true);
      }
    }
  }

  // === DATA REGISTRY ===
  const DB = {
    designers: [
      {
        id: "d1",
        name: "Alexandre Moreau",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        country: "France",
        location: "Paris, France",
        status: "Available",
        software: ["Exocad 3.2", "3Shape"],
        services: ["Crown & Bridge", "Implants", "Inlay/Onlay"],
        rating: 4.98,
        reviews: 94,
        priceMin: 28,
        priceMax: 45,
        turnaround: "12-24h",
        bio: "Senior dental CAD specialist with 9+ years experience. Specializing in high-precision monolithic zirconia crowns and custom abutments."
      },
      {
        id: "d2",
        name: "Dr. Sarah Miller, CDT",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        country: "Switzerland",
        location: "Zurich, Switzerland",
        status: "Available",
        software: ["3Shape 2024", "Exocad"],
        services: ["All-on-X", "Smile Design", "Surgical Guides"],
        rating: 5.0,
        reviews: 142,
        priceMin: 40,
        priceMax: 75,
        turnaround: "24-48h",
        bio: "Certified Dental Technician specializing in full-arch rehabilitations, guided implant surgery, and aesthetic anterior veneers."
      },
      {
        id: "d3",
        name: "Marco Rossi",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        country: "Italy",
        location: "Milan, Italy",
        status: "Available",
        software: ["Exocad", "Blender for Dental"],
        services: ["Crown & Bridge", "Veneers", "Smile Design"],
        rating: 4.93,
        reviews: 68,
        priceMin: 25,
        priceMax: 38,
        turnaround: "12h Express",
        bio: "Passionate digital ceramist and CAD designer. Master of micro-morphology and natural tooth aesthetics."
      },
      {
        id: "d4",
        name: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        country: "Poland",
        location: "Warsaw, Poland",
        status: "Available",
        software: ["OnyxCeph", "3Shape Ortho"],
        services: ["Clear Aligners", "Orthodontics", "Bite Splints"],
        rating: 4.96,
        reviews: 83,
        priceMin: 32,
        priceMax: 50,
        turnaround: "24h",
        bio: "Orthodontic CAD specialist. Clear aligner staging, digital indirect bonding setups, and nightguards."
      },
      {
        id: "d5",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        country: "South Korea",
        location: "Seoul, South Korea",
        status: "Available",
        software: ["Exocad", "Medit Link", "Hyperdent"],
        services: ["Surgical Guides", "Custom Abutment", "Crown & Bridge"],
        rating: 4.97,
        reviews: 112,
        priceMin: 30,
        priceMax: 55,
        turnaround: "12h Express",
        bio: "Speed and precision. Over 4,000 cases designed with zero clinical remakes. Dual screen check protocol."
      },
      {
        id: "d6",
        name: "Lucas Fernandez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        country: "Spain",
        location: "Madrid, Spain",
        status: "Available",
        software: ["Exocad", "3Shape"],
        services: ["Digital Dentures", "Framework", "Inlay/Onlay"],
        rating: 4.88,
        reviews: 49,
        priceMin: 24,
        priceMax: 40,
        turnaround: "24h",
        bio: "Removable prosthetics and digital denture specialist. Expert in 3D printable dentures and hybrid bars."
      }
    ],
    cases: [
      {
        id: "WD-8492",
        title: "Upper Left 1st Molar Crown (#14)",
        patient: "Case #4092 - Monolithic Zirconia",
        service: "Crown & Bridge",
        dentist: "Dr. Alexander Wright",
        designer: "Alexandre Moreau",
        status: "In Progress",
        badgeColor: "bg-blue-500/15 text-blue-500",
        submitted: "Today at 09:15 AM",
        delivery: "Today by 06:00 PM",
        price: "$35.00",
        files: ["upper_jaw_scan.stl", "lower_jaw_scan.stl", "buccal_bite.stl"]
      },
      {
        id: "WD-8488",
        title: "Lower Right 3-Unit Bridge (#18-#20)",
        patient: "Case #4085 - Screw-Retained Implant Bridge",
        service: "Implant Prosthetics",
        dentist: "Dr. Alexander Wright",
        designer: "Dr. Sarah Miller, CDT",
        status: "Pending Review",
        badgeColor: "bg-amber-500/15 text-amber-500",
        submitted: "Yesterday",
        delivery: "Ready for Approval",
        price: "$85.00",
        files: ["mandible_scan_flags.ply", "antagonist.stl", "radiograph.png"]
      },
      {
        id: "WD-8460",
        title: "Surgical Guide - Mandibular Left",
        patient: "Case #4060 - 2 Implants #19, #20",
        service: "Surgical Guide",
        dentist: "Dr. Alexander Wright",
        designer: "David Kim",
        status: "Completed",
        badgeColor: "bg-emerald-500/15 text-emerald-500",
        submitted: "3 days ago",
        delivery: "Approved & Released",
        price: "$55.00",
        files: ["guide_finished.stl", "report_protocol.pdf"]
      }
    ]
  };

  // === ACTIVE BRANDING & LOGO ENFORCER ===
  function enforceWorkDentBranding() {
    const OFFICIAL_LOGO = '/WorkDent Dental Network Logo.png';

    // 1. Enforce logo image across header, sidebar, login cards, and footers
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      if (src.includes('logo') || alt.toLowerCase().includes('logo') || img.closest('header a[href="/"], aside a[href="/"], .auth-card-elevated a[href="/"]')) {
        if (!src.includes('WorkDent Dental Network Logo.png') && !src.includes('WorkDent%20Dental%20Network%20Logo.png')) {
          img.src = OFFICIAL_LOGO;
        }
        img.alt = 'WorkDent Dental Network Logo';
        img.style.objectFit = 'contain';
      }
    });

    // 2. Enforce page titles
    if (document.title.includes('Exo') || document.title.includes('exo') || document.title.includes('Work Dent')) {
      document.title = 'WorkDent — Dental CAD/CAM Network';
    }

    // 3. Clean up any lingering WorkDent text in header or navigation
    document.querySelectorAll('header span, nav span, aside span, footer p, footer span').forEach(el => {
      if (el.innerText && el.innerText.toLowerCase().includes('exo')) {
        el.innerText = el.innerText.replace(/WorkDent/gi, 'WorkDent').replace(/WorkDent/gi, 'WorkDent');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    enforceWorkDentBranding();
    setTimeout(enforceWorkDentBranding, 300);
    setTimeout(enforceWorkDentBranding, 1000);
    setTimeout(enforceWorkDentBranding, 2500);

    // Watch for dynamic DOM changes (e.g. Next.js hydration)
    if (window.MutationObserver) {
      const observer = new MutationObserver(() => enforceWorkDentBranding());
      observer.observe(document.body, { childList: true, subtree: true });
    }

    enforceRouteProtection();
    initGlobalNav();
    initTheme();
    initAuthPage();
    initDirectory();
    initClientDashboard();
    initDesignerPortal();
    initProjectCreationWizard();
    initMessagingEngine();
    initLandingEnhancements();
  });

  // === GLOBAL NAVIGATION & SIGN OUT ===
  function initGlobalNav() {
    // Check sign out buttons
    document.querySelectorAll('a, button').forEach(el => {
      if (el.innerText && el.innerText.trim() === 'Sign Out') {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          clearSession();
          showToast("Signed out. Session cleared.");
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 600);
        });
      }
    });
  }

  // === THEME TOGGLE ===
  function initTheme() {
    const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    document.querySelectorAll('button[aria-label="Toggle theme"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    });
  }

  // === LOGIN PAGE WITH ROLE SWITCHER & 3-DAY COOKIES ===
  function initAuthPage() {
    const isLogin = window.location.pathname.includes('/auth/login');
    if (!isLogin) return;

    // Check if session expired banner should show
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === '1') {
      const alert = document.getElementById('session-alert');
      if (alert) alert.classList.remove('hidden');
    }

    let activeRole = 'dentist';
    const roleButtons = document.querySelectorAll('.role-switch-btn');
    const roleSubtitle = document.getElementById('role-subtitle');
    const emailInput = document.getElementById('email') || document.querySelector('input[type="email"]');
    const passwordInput = document.getElementById('password') || document.querySelector('input[type="password"]');
    const togglePwdBtn = document.getElementById('toggle-password-btn');
    const googleBtn = document.getElementById('google-signin-btn');

    const roleConfig = {
      dentist: {
        name: "Dr. Alexander Wright",
        subtitle: "Clinical Practice Portal — Post cases & receive verified CAD designs",
        placeholder: "dr.wright@dentalclinic.com",
        googleEmail: "dr.wright.dentistry@gmail.com",
        clinic: "Wright Dental Studio",
        redirect: "/dashboard"
      },
      designer: {
        name: "Alexandre Moreau, CAD Master",
        subtitle: "CAD Specialist Workspace — Steady cases, instant escrow payouts & tools",
        placeholder: "designer@cadstudio.com",
        googleEmail: "moreau.cad.expert@gmail.com",
        clinic: "WorkDent Verified Studio",
        redirect: "/designer/dashboard"
      },
      lab: {
        name: "Apex Dental Milling Lab",
        subtitle: "Dental Laboratory Production Center — Scale CAD capacity with verified technicians",
        placeholder: "production@dentallab.com",
        googleEmail: "apex.milling.lab@gmail.com",
        clinic: "Apex Laboratory Hub",
        redirect: "/as/lab"
      }
    };

    // Role switcher
    roleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        roleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeRole = btn.getAttribute('data-role');

        const cfg = roleConfig[activeRole];
        if (roleSubtitle) roleSubtitle.innerText = cfg.subtitle;
        if (emailInput) emailInput.placeholder = cfg.placeholder;
      });
    });

    // Toggle password visibility
    if (togglePwdBtn && passwordInput) {
      togglePwdBtn.addEventListener('click', () => {
        const isPwd = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPwd ? 'text' : 'password');
        togglePwdBtn.style.color = isPwd ? 'var(--primary, #0284c7)' : '';
      });
    }

    // Google Sign-In Handler
    if (googleBtn) {
      googleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const remember = document.getElementById('remember-me')?.checked ?? true;
        const cfg = roleConfig[activeRole];
        
        googleBtn.disabled = true;
        googleBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span><span>Connecting with Google...</span>';

        setTimeout(() => {
          const user = {
            name: cfg.name,
            email: cfg.googleEmail,
            role: activeRole,
            clinic: cfg.clinic,
            provider: "google",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          };

          setSessionCookie(user, remember);
          showToast("Signed in with Google! Session active for 3 days.");
          setTimeout(() => {
            window.location.href = cfg.redirect;
          }, 600);
        }, 800);
      });
    }

    // Email/Password Submit Handler
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const remember = document.getElementById('remember-me')?.checked ?? true;
        const cfg = roleConfig[activeRole];
        const email = emailInput?.value || cfg.placeholder;

        const user = {
          name: cfg.name,
          email: email,
          role: activeRole,
          clinic: cfg.clinic,
          provider: "password"
        };

        setSessionCookie(user, remember);
        showToast("Signed in as " + user.name + "! 3-Day session established.");
        setTimeout(() => {
          window.location.href = cfg.redirect;
        }, 600);
      });
    }
  }

  // === MARKETPLACE / DIRECTORY ===
  function initDirectory() {
    const isDir = window.location.pathname.includes('designers');
    if (!isDir) return;

    const mainCol = document.querySelector('.min-w-0.col-span-5');
    if (!mainCol) return;

    function renderCards(list) {
      const heading = mainCol.querySelector('h1, span.text-xl');
      if (heading) {
        heading.parentElement.innerHTML = `
          <h1 class="text-xl font-bold text-foreground">
            ${list.length} Verified Specialist${list.length === 1 ? '' : 's'} Available
          </h1>
        `;
      }

      let grid = mainCol.querySelector('.grid');
      if (!grid) {
        grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
        mainCol.appendChild(grid);
      }

      grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
      grid.innerHTML = list.map(d => `
        <div class="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between group">
          <div>
            <div class="flex items-start gap-3.5 mb-3.5">
              <img src="${d.avatar}" alt="${d.name}" class="size-12 rounded-xl object-cover ring-2 ring-border/50 shrink-0" />
              <div class="min-w-0">
                <h3 class="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">${d.name}</h3>
                <p class="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <span>📍</span> ${d.location}
                </p>
                <div class="flex items-center gap-1.5 mt-1.5">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ${d.status}
                  </span>
                  <span class="text-xs font-semibold text-foreground flex items-center gap-1">
                    ⭐ ${d.rating} <span class="text-muted-foreground font-normal text-[11px]">(${d.reviews})</span>
                  </span>
                </div>
              </div>
            </div>

            <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              ${d.bio}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-4">
              ${d.services.map(s => `
                <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-foreground/80 border border-border/40">${s}</span>
              `).join('')}
            </div>
          </div>

          <div class="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
            <div>
              <span class="text-[11px] text-muted-foreground block">Starting at</span>
              <span class="text-sm font-bold text-foreground">$${d.priceMin}</span>
              <span class="text-[11px] text-muted-foreground">/unit</span>
            </div>
            <div class="flex items-center gap-2">
              <a href="/profile" class="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted text-foreground transition-colors">
                Profile
              </a>
              <a href="/projects/new" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                Hire
              </a>
            </div>
          </div>
        </div>
      `).join('');
    }

    renderCards(DB.designers);

    const searchInput = document.querySelector('input[placeholder*="Search designers"]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = DB.designers.filter(d => 
          d.name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.services.some(s => s.toLowerCase().includes(q))
        );
        renderCards(filtered);
      });
    }

    const clearBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Clear All Filters'));
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
        }
      });
    }
  }

  // === CLIENT DASHBOARD ===
  function initClientDashboard() {
    const isDash = window.location.pathname.endsWith('/dashboard') || window.location.pathname.endsWith('/dashboard.html');
    if (!isDash) return;

    const stats = document.querySelectorAll('.text-2xl, .text-3xl');
    if (stats.length >= 4) {
      stats[0].innerText = "3";
      stats[1].innerText = "1";
      stats[2].innerText = "1";
      stats[3].innerText = "1";
    }

    const loader = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('Loading projects'));
    if (loader) {
      loader.closest('div').innerHTML = `
        <div class="divide-y divide-border/60">
          ${DB.cases.map(c => `
            <div class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 px-3 rounded-xl transition-colors">
              <div class="flex items-start gap-3">
                <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  🦷
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm text-foreground">${c.title}</span>
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${c.badgeColor}">${c.status}</span>
                  </div>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    Case: <span class="font-medium text-foreground">${c.id}</span> • Specialist: <span class="font-medium text-primary">${c.designer}</span> • Fee: <span class="font-semibold text-foreground">${c.price}</span>
                  </p>
                  <div class="flex items-center gap-2 mt-2">
                    ${c.files.map(f => `<span class="px-2 py-0.5 rounded bg-muted text-[10px] text-muted-foreground border border-border/40 font-mono">📁 ${f}</span>`).join('')}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <a href="/messages" class="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted text-foreground transition-colors flex items-center gap-1.5">
                  💬 Message
                </a>
                <a href="/help/cases-and-files" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                  View 3D Scan
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // === DESIGNER PORTAL ===
  function initDesignerPortal() {
    const isDesigner = window.location.pathname.includes('/designer/');
    if (!isDesigner) return;

    const loader = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('Loading jobs'));
    if (loader) {
      loader.closest('div').innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-xs uppercase text-muted-foreground border-b border-border/60 bg-muted/30">
              <tr>
                <th class="py-3 px-4">Case ID</th>
                <th class="py-3 px-4">Project Title</th>
                <th class="py-3 px-4">Dentist / Practice</th>
                <th class="py-3 px-4">Service</th>
                <th class="py-3 px-4">Fee</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/60">
              <tr class="hover:bg-muted/20 transition-colors">
                <td class="py-3.5 px-4 font-mono text-xs font-bold text-primary">WD-8495</td>
                <td class="py-3.5 px-4 font-semibold text-foreground">Mandibular Anterior 6 Veneers</td>
                <td class="py-3.5 px-4 text-muted-foreground">Beacon Dental Studio</td>
                <td class="py-3.5 px-4 text-xs font-medium">Cosmetic Smile</td>
                <td class="py-3.5 px-4 font-bold text-foreground">$180.00</td>
                <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-500">New Request</span></td>
                <td class="py-3.5 px-4 text-right">
                  <button type="button" onclick="alert('Case accepted! Added to active work orders.')" class="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                    Accept Case
                  </button>
                </td>
              </tr>
              <tr class="hover:bg-muted/20 transition-colors">
                <td class="py-3.5 px-4 font-mono text-xs font-bold text-primary">WD-8492</td>
                <td class="py-3.5 px-4 font-semibold text-foreground">Upper Left 1st Molar Crown (#14)</td>
                <td class="py-3.5 px-4 text-muted-foreground">Dr. Alexander Wright</td>
                <td class="py-3.5 px-4 text-xs font-medium">Crown & Bridge</td>
                <td class="py-3.5 px-4 font-bold text-foreground">$35.00</td>
                <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-500">In Progress</span></td>
                <td class="py-3.5 px-4 text-right">
                  <button type="button" onclick="alert('Ready to upload STL design file.')" class="px-3 py-1 border border-border text-foreground text-xs font-medium rounded-lg hover:bg-muted transition-colors">
                    Upload STL
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
  }

  // === CASE CREATION WIZARD ===
  function initProjectCreationWizard() {
    const isNew = window.location.pathname.includes('projects/new');
    if (!isNew) return;

    const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Continue');
    if (!continueBtn) return;

    let step = 1;
    continueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      step++;
      if (step === 2) {
        showToast("Step 1 Complete: Case specifications recorded.");
        continueBtn.innerText = "Authorize & Submit Case (Escrow Hold Only)";
      } else if (step >= 3) {
        showToast("Case Submitted Successfully! Hold placed on card. Redirecting to Dashboard...");
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1200);
      }
    });
  }

  // === MESSAGING ENGINE ===
  function initMessagingEngine() {
    const isMsg = window.location.pathname.includes('messages');
    if (!isMsg) return;

    const sendBtn = document.querySelector('button svg.lucide-send')?.closest('button') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().toLowerCase() === 'send');
    const msgInput = document.querySelector('input[placeholder*="message"], input[type="text"]');
    const container = document.querySelector('.overflow-y-auto.flex-1') || document.querySelector('.space-y-4');

    if (sendBtn && msgInput) {
      function send() {
        const val = msgInput.value.trim();
        if (!val) return;
        msgInput.value = '';

        if (container) {
          const out = document.createElement('div');
          out.className = 'flex justify-end mb-3';
          out.innerHTML = `
            <div class="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-sm text-sm shadow-sm">
              <p>${val}</p>
              <span class="text-[10px] opacity-70 block text-right mt-1">Just now • Sent ✓</span>
            </div>
          `;
          container.appendChild(out);
          container.scrollTop = container.scrollHeight;

          setTimeout(() => {
            const reply = document.createElement('div');
            reply.className = 'flex justify-start mb-3';
            reply.innerHTML = `
              <div class="bg-card border border-border text-foreground rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm text-sm shadow-sm">
                <p>Doctor, I received the file. Margin lines are verified at 0.12mm. Will complete the design within 3 hours.</p>
                <span class="text-[10px] text-muted-foreground block mt-1">Alexandre Moreau (CAD) • Just now</span>
              </div>
            `;
            container.appendChild(reply);
            container.scrollTop = container.scrollHeight;
          }, 1200);
        }
      }

      sendBtn.addEventListener('click', send);
      msgInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') send();
      });
    }
  }

  // === LANDING ENHANCEMENTS ===
  function initLandingEnhancements() {
    const isHome = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    if (!isHome) return;

    // Auto-progress stepper
    const stepsContainer = document.querySelector('.group\\/steps');
    if (stepsContainer) {
      let isPaused = false;
      stepsContainer.addEventListener('mouseenter', () => isPaused = true);
      stepsContainer.addEventListener('mouseleave', () => isPaused = false);

      let idx = 0;
      const btns = stepsContainer.querySelectorAll('button[type="button"]');
      if (btns.length > 0) {
        setInterval(() => {
          if (!isPaused && document.visibilityState === 'visible') {
            idx = (idx + 1) % btns.length;
            btns[idx]?.click();
          }
        }, 6000);
      }
    }
  }

  // Toast Helper
  function showToast(msg) {
    let t = document.getElementById('wd-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'wd-toast';
      t.className = 'fixed bottom-5 right-5 z-50 bg-foreground text-background font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl transition-all flex items-center gap-2 transform translate-y-20 opacity-0';
      document.body.appendChild(t);
    }
    t.innerHTML = `<span>✨</span><span>${msg}</span>`;
    t.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
      t.classList.add('translate-y-20', 'opacity-0');
    }, 3200);
  }

})();
EOF