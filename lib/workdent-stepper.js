/**
 * WorkDent Automatic How-It-Works Stepper & Interactive UI Engine
 * Features:
 * - Scroll-aware automatic step progression via IntersectionObserver (NO page scroll hijacking)
 * - Animated progress bar per step
 * - Instant manual step switching with graceful pause & resume
 * - Keyboard navigation (Arrow keys)
 * - prefers-reduced-motion support
 * - Mobile navigation drawer and solutions dropdown controllers
 */

(function () {
  'use strict';

  // 1. Data Store for the 5 Workflow Steps
  const STEPS_DATA = [
    {
      step: 1,
      badge: "Step 01 of 05",
      eyebrow: "STEP 01",
      title: "Post your case",
      summary: "Tell the designer what you need. It takes a couple of minutes and you do it once per case.",
      points: [
        "Pick the service you need from the ones designers offer",
        "Give the case a title, like Crown & Bridge - Upper Left Molar",
        "Add your notes: teeth involved, material, occlusion, anything unusual"
      ],
      visual: "./help/getting-started-dentist/03-new-project-case-details.png",
      visualAlt: "WorkDent case submission form with service selection and clinical case notes",
      nextLabel: "Choose your designer"
    },
    {
      step: 2,
      badge: "Step 02 of 05",
      eyebrow: "STEP 02",
      title: "Choose your designer",
      summary: "You pick who does the work. No waiting to be assigned someone you have never seen.",
      points: [
        "See every designer who offers your service, with their price",
        "Open a profile to check their work samples and reviews",
        "Browse the whole directory before you create an account"
      ],
      visual: "./help/getting-started-dentist/02-dashboard.png",
      visualAlt: "WorkDent verified dental CAD designer directory with filter by specialty",
      nextLabel: "Upload your scans"
    },
    {
      step: 3,
      badge: "Step 03 of 05",
      eyebrow: "STEP 03",
      title: "Upload your scans",
      summary: "Drop in whatever the designer needs to start. Several files at once is fine.",
      points: [
        "STL, OBJ, PNG, JPG, WEBP, PDF and ZIP are all accepted",
        "Up to 50 MB per file and 500 MB per case",
        "Files stay attached to the case, so nothing gets lost in email"
      ],
      visual: "./help/getting-started-dentist/04-upload-scan-files.png",
      visualAlt: "Upload Scan Files drag and drop clinical file workspace",
      nextLabel: "Authorize, don't pay"
    },
    {
      step: 4,
      badge: "Step 04 of 05",
      eyebrow: "STEP 04",
      title: "Authorize, don't pay",
      summary: "Your card is held, not charged. The money only moves when a designer accepts your case.",
      points: [
        "A hold is placed for the case amount when you submit",
        "You are charged only once a designer accepts",
        "If nobody takes the case in 6 days, the hold is released and you pay nothing"
      ],
      visual: "./help/getting-started-dentist/01-create-account.png",
      visualAlt: "WorkDent Escrow payment protection authorization confirmation",
      nextLabel: "Review and approve"
    },
    {
      step: 5,
      badge: "Step 05 of 05",
      eyebrow: "STEP 05",
      title: "Review and approve",
      summary: "Everything for the case lives on one screen: the files, a 3D preview, the history and your conversation with the designer.",
      points: [
        "Spin and zoom STL, PLY and OBJ files right in the browser",
        "Attach a digital design web link and review it inside the case",
        "Accept the design, send it back for a revision, or open a dispute"
      ],
      visual: "./img/home/case-3d-viewer.webp",
      visualAlt: "WorkDent interactive 3D browser STL viewer and clinical case timeline",
      nextLabel: "Post your case"
    }
  ];

  const STEP_DURATION_MS = 4500; // 4.5 seconds per step
  const MANUAL_PAUSE_MS = 10000;  // 10 seconds pause on manual click

  let currentStepIdx = 0;
  let isSectionVisible = false;
  let isManuallyPaused = false;
  let pauseTimeoutId = null;
  let stepTimerStartTime = 0;
  let animationFrameId = null;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM Elements cache
  let stepperSection, tabs, activeBadge, activeTitle, activeSummary, activePoints, activeVisual, nextBtn, prevBtn, nextBtnLabel;

  function initStepper() {
    stepperSection = document.getElementById('how-it-works');
    if (!stepperSection) return;

    tabs = document.querySelectorAll('.wd-step-tab');
    activeBadge = document.getElementById('active-step-badge');
    activeTitle = document.getElementById('active-step-title');
    activeSummary = document.getElementById('active-step-summary');
    activePoints = document.getElementById('active-step-points');
    activeVisual = document.getElementById('active-step-visual');
    nextBtn = document.getElementById('step-next-btn');
    prevBtn = document.getElementById('step-prev-btn');
    nextBtnLabel = document.getElementById('step-next-label');

    // Attach click handlers to all tabs
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        onUserSelectStep(index);
      });
      // Keyboard accessible
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onUserSelectStep(index);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (index + 1) % STEPS_DATA.length;
          tabs[next]?.focus();
          onUserSelectStep(next);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (index - 1 + STEPS_DATA.length) % STEPS_DATA.length;
          tabs[prev]?.focus();
          onUserSelectStep(prev);
        }
      });
    });

    // Next / Prev button events
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const next = (currentStepIdx + 1) % STEPS_DATA.length;
        onUserSelectStep(next);
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prev = (currentStepIdx - 1 + STEPS_DATA.length) % STEPS_DATA.length;
        onUserSelectStep(prev);
      });
    }

    // Set initial step 0
    renderStep(0, false);

    // Setup IntersectionObserver for auto-progression
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isSectionVisible = entry.isIntersecting;
          if (isSectionVisible && !prefersReducedMotion && !isManuallyPaused) {
            startStepTimer();
          } else {
            stopStepTimer();
          }
        });
      }, { threshold: 0.25 });
      observer.observe(stepperSection);
    } else {
      // Fallback
      isSectionVisible = true;
      if (!prefersReducedMotion) startStepTimer();
    }
  }

  function renderStep(index, animateVisual = true) {
    currentStepIdx = index;
    const data = STEPS_DATA[index];
    if (!data) return;

    // 1. Update Tabs Active State
    tabs.forEach((tab, i) => {
      const pBar = tab.querySelector('.wd-step-progress-bar');
      if (i === index) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        if (pBar) pBar.style.width = '0%';
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
        if (pBar) pBar.style.width = '0%';
      }
    });

    // 2. Update Content Details
    if (activeBadge) activeBadge.textContent = data.badge;
    if (activeTitle) activeTitle.textContent = data.title;
    if (activeSummary) activeSummary.textContent = data.summary;

    if (activePoints) {
      activePoints.innerHTML = '';
      data.points.forEach(pt => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2.5';
        li.innerHTML = `
          <svg class="size-4 shrink-0 mt-1" style="color: #2563EB;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"></circle>
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"></path>
          </svg>
          <span style="color: #334155; font-size: 0.9375rem; line-height: 1.5;">${pt}</span>
        `;
        activePoints.appendChild(li);
      });
    }

    // 3. Update Visual Image
    if (activeVisual) {
      if (animateVisual) {
        activeVisual.style.opacity = '0.6';
        activeVisual.style.transform = 'scale(0.98)';
        setTimeout(() => {
          activeVisual.src = data.visual;
          activeVisual.alt = data.visualAlt;
          activeVisual.style.opacity = '1';
          activeVisual.style.transform = 'scale(1)';
        }, 120);
      } else {
        activeVisual.src = data.visual;
        activeVisual.alt = data.visualAlt;
      }
    }

    if (nextBtnLabel) {
      nextBtnLabel.textContent = `Next: ${data.nextLabel}`;
    }
  }

  function startStepTimer() {
    stopStepTimer();
    stepTimerStartTime = performance.now();

    function tick(now) {
      if (!isSectionVisible || isManuallyPaused || prefersReducedMotion) {
        return;
      }
      const elapsed = now - stepTimerStartTime;
      const progress = Math.min(100, (elapsed / STEP_DURATION_MS) * 100);

      // Update current active tab's progress bar
      const activeTab = tabs[currentStepIdx];
      if (activeTab) {
        const bar = activeTab.querySelector('.wd-step-progress-bar');
        if (bar) bar.style.width = progress + '%';
      }

      if (elapsed >= STEP_DURATION_MS) {
        // Step finished -> Advance to next
        const next = (currentStepIdx + 1) % STEPS_DATA.length;
        renderStep(next);
        stepTimerStartTime = performance.now();
      }

      animationFrameId = requestAnimationFrame(tick);
    }

    animationFrameId = requestAnimationFrame(tick);
  }

  function stopStepTimer() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    // Reset active bar width
    if (tabs && tabs[currentStepIdx]) {
      const bar = tabs[currentStepIdx].querySelector('.wd-step-progress-bar');
      if (bar) bar.style.width = '0%';
    }
  }

  function onUserSelectStep(index) {
    renderStep(index);

    // Pause auto timer temporarily
    isManuallyPaused = true;
    stopStepTimer();

    if (pauseTimeoutId) clearTimeout(pauseTimeoutId);
    pauseTimeoutId = setTimeout(() => {
      isManuallyPaused = false;
      if (isSectionVisible && !prefersReducedMotion) {
        startStepTimer();
      }
    }, MANUAL_PAUSE_MS);
  }

  // DOM Ready initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initStepper();
    });
  } else {
    initStepper();
  }

  // Expose global controller for manual programmatic calls
  window.WorkDentStepper = {
    setStep: onUserSelectStep,
    next: () => {
      const next = (currentStepIdx + 1) % STEPS_DATA.length;
      onUserSelectStep(next);
    },
    prev: () => {
      const prev = (currentStepIdx - 1 + STEPS_DATA.length) % STEPS_DATA.length;
      onUserSelectStep(prev);
    }
  };

})();
