/**
 * WorkDent / WorkDent Global Interactivity & Component Handler
 * Supports:
 * - Theme toggle (Dark / Light mode)
 * - Header dropdowns ("I'm a dentist" / Solutions)
 * - Mobile Navigation Drawer
 * - 5-Step Stepper & Accordion ("How It Works")
 * - Back buttons ("Go back")
 * - Designers directory search & filter clearing
 * - FAQ & Accordion expansion
 * - Video autoplay
 * - Newsletter subscribe validation
 * - Dynamic image error resolution
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDropdowns();
  initMobileMenu();
  initStepper();
  initBackButtons();
  initDesignerSearch();
  initFaqAccordions();
  initSubscribe();
  initVideos();
  fixBrokenImages();
});

// 1. Theme Toggle
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  document.querySelectorAll('button[aria-label="Toggle theme"], button.theme-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
}

// 2. Dropdowns ("I'm a dentist" / Solutions)
function initDropdowns() {
  const triggers = document.querySelectorAll('[data-slot="dropdown-menu-trigger"]');
  triggers.forEach(trigger => {
    const text = trigger.innerText.trim();
    if (text.includes("dentist") || text.includes("Solutions") || text.includes("Menu") || trigger.querySelector('svg.lucide-chevron-down')) {
      let popover = trigger.parentElement.querySelector('.dropdown-popover');
      if (!popover) {
        popover = document.createElement('div');
        popover.className = 'dropdown-popover hidden absolute top-full left-0 mt-2 w-64 rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl p-2 z-50 flex flex-col gap-1 transition-all';
        popover.innerHTML = `
          <a href="/as/dentist" class="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2.5">
            <span class="text-base">🦷</span>
            <div class="flex flex-col text-left">
              <span>For Dentists</span>
              <span class="text-xs text-muted-foreground font-normal">Fast turnarounds & verified CAD specialists</span>
            </div>
          </a>
          <a href="/as/designer" class="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2.5">
            <span class="text-base">📐</span>
            <div class="flex flex-col text-left">
              <span>For CAD Designers</span>
              <span class="text-xs text-muted-foreground font-normal">Steady cases, escrow protection & instant payouts</span>
            </div>
          </a>
          <a href="/as/lab" class="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2.5">
            <span class="text-base">🏭</span>
            <div class="flex flex-col text-left">
              <span>For Dental Labs</span>
              <span class="text-xs text-muted-foreground font-normal">Scale capacity without hiring full-time staff</span>
            </div>
          </a>
        `;
        trigger.parentElement.style.position = 'relative';
        trigger.parentElement.appendChild(popover);
      }

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !popover.classList.contains('hidden');
        document.querySelectorAll('.dropdown-popover').forEach(p => p.classList.add('hidden'));
        if (!isOpen) {
          popover.classList.remove('hidden');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-popover').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('[data-slot="dropdown-menu-trigger"]').forEach(t => t.setAttribute('aria-expanded', 'false'));
  });
}

// 3. Mobile Navigation Drawer
function initMobileMenu() {
  const mobileBtn = document.querySelector('header button[aria-label="Open menu"]') || document.querySelector('button[aria-label="Open menu"]');
  if (!mobileBtn) return;

  let drawer = document.getElementById('workdent-mobile-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'workdent-mobile-drawer';
    drawer.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex justify-end';
    drawer.innerHTML = `
      <div class="w-4/5 max-w-sm h-full bg-background border-l border-border p-6 flex flex-col justify-between shadow-2xl">
        <div class="flex flex-col gap-6">
          <div class="flex items-center justify-between border-b border-border/50 pb-4">
            <span class="text-xl font-bold text-primary">WorkDent</span>
            <button id="close-mobile-drawer" class="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>
          <nav class="flex flex-col gap-3">
            <a href="/how-it-works" class="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted">How it works?</a>
            <a href="/#features" class="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted">Features</a>
            <a href="/as/dentist" class="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted">For Dentists</a>
            <a href="/as/designer" class="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted">For CAD Designers</a>
            <a href="/as/lab" class="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted">For Dental Labs</a>
            <a href="/designers" class="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted">Browse Designers</a>
            <a href="/designer/dashboard" class="px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-muted">Designer Portal</a>
          </nav>
        </div>
        <div class="flex flex-col gap-3 pt-6 border-t border-border/50">
          <a href="/auth/login" class="w-full py-2.5 text-center text-sm font-medium rounded-lg border border-border hover:bg-muted">Login</a>
          <a href="/auth/register" class="w-full py-2.5 text-center text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">Get Started</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    drawer.querySelector('#close-mobile-drawer').addEventListener('click', () => {
      drawer.classList.add('hidden');
    });
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) drawer.classList.add('hidden');
    });
  }

  mobileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer.classList.remove('hidden');
  });
}

// 4. Stepper Component
function initStepper() {
  const stepsContainer = document.querySelector('.group\\/steps');
  if (!stepsContainer) return;

  const stepsData = [
    {
      step: 1,
      title: "Post your case",
      summary: "Tell the designer what you need. It takes a couple of minutes and you do it once per case.",
      points: [
        "Pick the service you need from the ones designers offer",
        "Give the case a title, like Crown & Bridge - Upper Left Molar",
        "Add your notes: teeth involved, material, occlusion, anything unusual"
      ],
      visualType: "image",
      src: "/help/getting-started-dentist/03-new-project-case-details.png",
      alt: "Post case details screenshot"
    },
    {
      step: 2,
      title: "Choose your designer",
      summary: "Pick a designer from the directory, or let whoever is free pick up the case.",
      points: [
        "Browse by turnaround time, review ratings, or recent work",
        "Compare pricing for the service you selected",
        "Or leave it open: the first available designer can take it"
      ],
      visualType: "designers"
    },
    {
      step: 3,
      title: "Upload your scans",
      summary: "Drop in whatever the designer needs to start. Several files at once is fine.",
      points: [
        "STL, OBJ, PNG, JPG, WEBP, PDF and ZIP are all accepted",
        "Up to 50 MB per file and 500 MB per case",
        "Files stay attached to the case, so nothing gets lost in email"
      ],
      visualType: "image",
      src: "/help/getting-started-dentist/04-upload-scan-files.png",
      alt: "Upload scans screenshot"
    },
    {
      step: 4,
      title: "Authorize, don't pay",
      summary: "Your card is held, not charged. The money only moves when a designer accepts your case.",
      points: [
        "A hold is placed for the case amount when you submit",
        "You are charged only once a designer accepts",
        "If nobody takes the case in 6 days, the hold is released and you pay nothing"
      ],
      visualType: "hold"
    },
    {
      step: 5,
      title: "Review and approve",
      summary: "Everything for the case lives on one screen: the files, a 3D preview, the history and your conversation with the designer.",
      points: [
        "Spin and zoom STL, PLY and OBJ files right in the browser",
        "Attach a digital design web link and review it inside the case",
        "Accept the design, send it back for a revision, or open a dispute"
      ],
      visualType: "image",
      src: "/img/home/case-3d-viewer.webp",
      alt: "3D dental viewer screenshot"
    }
  ];

  let currentStep = 0;
  const buttons = stepsContainer.querySelectorAll('button[type="button"]');
  const rightColumn = stepsContainer.parentElement.querySelector('.lg\\:sticky');

  function renderVisual(idx) {
    if (!rightColumn) return;
    const data = stepsData[idx];
    const visualSlot = rightColumn.firstElementChild;
    if (!visualSlot) return;

    if (data.visualType === "image") {
      visualSlot.outerHTML = `
        <div class="rounded-2xl border border-border bg-card shadow-xl overflow-hidden aspect-[4/3] flex items-center justify-center p-2 bg-muted/20">
          <img src="${data.src}" alt="${data.alt}" class="w-full h-full object-contain rounded-xl" />
        </div>
      `;
    } else if (data.visualType === "designers") {
      visualSlot.outerHTML = `
        <div class="rounded-2xl border border-border bg-card shadow-xl p-6 sm:p-8 flex flex-col justify-center gap-5 aspect-[4/3]">
          <div class="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <svg class="size-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <h3 class="text-xl sm:text-2xl font-bold text-foreground leading-tight">See the designers before you sign up.</h3>
            <p class="mt-3 text-sm text-muted-foreground leading-relaxed">The designer directory is open to everyone. Search by service, check availability, and open any profile to see their work samples, reviews and prices.</p>
          </div>
          <div>
            <a href="/designers" class="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all">
              Browse designers <span>→</span>
            </a>
          </div>
        </div>
      `;
    } else if (data.visualType === "hold") {
      visualSlot.outerHTML = `
        <div class="rounded-2xl border border-border bg-card shadow-xl p-6 sm:p-8 flex flex-col justify-center gap-6 aspect-[4/3]">
          <p class="text-primary text-[11px] font-bold tracking-[0.18em] uppercase">How the money moves</p>
          <ol class="flex flex-col gap-4">
            <li class="flex gap-4 items-start">
              <span class="shrink-0 size-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p class="font-semibold text-foreground text-sm">You submit</p>
                <p class="text-muted-foreground text-xs leading-relaxed mt-0.5">Card authorized. Nothing is charged yet.</p>
              </div>
            </li>
            <li class="flex gap-4 items-start">
              <span class="shrink-0 size-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p class="font-semibold text-foreground text-sm">Designer accepts</p>
                <p class="text-muted-foreground text-xs leading-relaxed mt-0.5">Your card is charged and the case moves to In Progress.</p>
              </div>
            </li>
            <li class="flex gap-4 items-start">
              <span class="shrink-0 size-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p class="font-semibold text-foreground text-sm">You approve the design</p>
                <p class="text-muted-foreground text-xs leading-relaxed mt-0.5">You rate the designer and payment is released.</p>
              </div>
            </li>
          </ol>
          <p class="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">No designer in 6 days? The hold is released and you pay nothing.</p>
        </div>
      `;
    }

    const counter = rightColumn.querySelector('.tabular-nums');
    if (counter) counter.innerText = `Step ${idx + 1} of ${stepsData.length}`;

    const prevBtn = rightColumn.querySelector('button[aria-label="Previous step"]');
    if (prevBtn) {
      if (idx === 0) {
        prevBtn.setAttribute('disabled', 'true');
        prevBtn.classList.add('opacity-50', 'pointer-events-none');
      } else {
        prevBtn.removeAttribute('disabled');
        prevBtn.classList.remove('opacity-50', 'pointer-events-none');
      }
    }

    const nextBtn = rightColumn.querySelectorAll('button')[1];
    if (nextBtn) {
      if (idx === stepsData.length - 1) {
        nextBtn.innerHTML = `Back to step 1`;
      } else {
        nextBtn.innerHTML = `Next: ${stepsData[idx + 1].title} <svg class="size-4 inline ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`;
      }
    }
  }

  function setStep(idx) {
    currentStep = idx;
    buttons.forEach((btn, i) => {
      const isCurrent = i === idx;
      btn.setAttribute('aria-expanded', isCurrent ? 'true' : 'false');
      btn.className = `group text-left rounded-xl px-4 py-4 transition-colors w-full ${isCurrent ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06] focus-visible:bg-white/[0.06]'}`;
      
      const badge = btn.querySelector('.tabular-nums');
      if (badge) {
        badge.className = `text-[11px] font-bold tracking-widest tabular-nums ${isCurrent ? 'text-primary-foreground/70' : 'text-white/30'}`;
      }

      const iconBox = btn.querySelector('.size-9');
      if (iconBox) {
        iconBox.className = `shrink-0 size-9 rounded-lg flex items-center justify-center ${isCurrent ? 'bg-primary' : 'bg-white/10'}`;
      }

      let details = btn.querySelector('.step-detail-container');
      if (!details && isCurrent) {
        details = document.createElement('span');
        details.className = 'step-detail-container block mt-4 pl-[3.25rem] pr-1';
        const d = stepsData[i];
        details.innerHTML = `
          <span class="block text-white/70 text-[13.5px] leading-relaxed">${d.summary}</span>
          <span class="block mt-4 space-y-2">
            ${d.points.map(p => `
              <span class="flex gap-2.5 text-white/60 text-[13px] leading-relaxed">
                <svg class="size-3.5 shrink-0 mt-1 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                <span>${p}</span>
              </span>
            `).join('')}
          </span>
        `;
        btn.appendChild(details);
      } else if (details) {
        details.style.display = isCurrent ? 'block' : 'none';
      }
    });

    renderVisual(idx);
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => setStep(i));
  });

  if (rightColumn) {
    const prevBtn = rightColumn.querySelector('button[aria-label="Previous step"]');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 0) setStep(currentStep - 1);
      });
    }

    const nextBtn = rightColumn.querySelectorAll('button')[1];
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep < stepsData.length - 1) {
          setStep(currentStep + 1);
        } else {
          setStep(0);
        }
      });
    }
  }

  setStep(0);
}

// 5. Back Buttons
function initBackButtons() {
  document.querySelectorAll('button').forEach(btn => {
    if (btn.innerText.trim().includes('Go back') || btn.getAttribute('aria-label') === 'Back') {
      btn.addEventListener('click', () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      });
    }
  });
}

// 6. Designers Search & Filter clearing
function initDesignerSearch() {
  const searchInput = document.querySelector('input[placeholder*="Search designers"]');
  const clearBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Clear All Filters'));
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.grid > div');
      cards.forEach(card => {
        if (card.querySelector('h3, h4, p')) {
          const text = card.innerText.toLowerCase();
          card.style.display = text.includes(q) ? '' : 'none';
        }
      });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      }
      document.querySelectorAll('select').forEach(sel => sel.selectedIndex = 0);
    });
  }
}

// 7. FAQ Accordion Handling
function initFaqAccordions() {
  document.querySelectorAll('button[aria-expanded]').forEach(btn => {
    if (btn.closest('.group\\/steps')) return; // handled by stepper
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      const content = btn.nextElementSibling;
      if (content) {
        content.style.display = isExpanded ? 'none' : 'block';
      }
    });
  });
}

// 8. Newsletter
function initSubscribe() {
  document.querySelectorAll('footer form, footer div').forEach(parent => {
    const btn = parent.querySelector('button');
    const input = parent.querySelector('input[type="email"]');
    if (btn && input && btn.innerText.trim().toLowerCase() === 'subscribe') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (input.value && input.value.includes('@')) {
          const original = btn.innerText;
          btn.innerText = 'Subscribed! ✓';
          btn.classList.add('bg-emerald-600');
          setTimeout(() => {
            btn.innerText = original;
            btn.classList.remove('bg-emerald-600');
            input.value = '';
          }, 3000);
        } else {
          input.focus();
          input.classList.add('ring-2', 'ring-red-500');
          setTimeout(() => input.classList.remove('ring-2', 'ring-red-500'), 2000);
        }
      });
    }
  });
}

// 9. Autoplay Video Handlers
function initVideos() {
  document.querySelectorAll('video').forEach(v => {
    v.muted = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('autoplay', '');
    v.setAttribute('loop', '');
    v.play().catch(() => {});
  });
}

// 10. Fix any remaining broken image tags
function fixBrokenImages() {
  document.querySelectorAll('img').forEach(img => {
    let src = img.getAttribute('src') || '';
    let srcset = img.getAttribute('srcset') || '';
    if (src.includes('/_next/image')) {
      const match = (srcset || src).match(/url=([^&]+)/);
      if (match) {
        const decoded = decodeURIComponent(match[1]);
        img.src = decoded;
        img.removeAttribute('srcset');
      }
    }
  });
}
