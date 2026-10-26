/**
 * WorkDent Banner System Engine
 * Interactive clinical showcase slider with auto-progression, tab switching, and keyboard navigation.
 */
(function () {
  'use strict';

  const BANNERS = [
    {
      idx: 0,
      badge: "Clinical Workflow 01",
      title: "Zero-Loss Scan Ingestion Directly From Chairside",
      desc: "Seamlessly transfer STL, PLY, and OBJ datasets directly from Medit Link, 3Shape TRIOS, and iTero scanners. No fragmented email threads or third-party download expirations.",
      metric: "Direct Optical Scanner Ingestion",
      features: [
        "Instant multi-gigabyte cloud upload with resumable transfer",
        "Patient data protection & HIPAA-compliant encryption"
      ],
      image: "./img/banners/banner-clinic.webp",
      imageAlt: "WorkDent Chairside Scan Ingestion and intraoral scanning"
    },
    {
      idx: 1,
      badge: "Clinical Workflow 02",
      title: "12-Micron CAD Margin Verification in Exocad & 3Shape",
      desc: "Specialist CAD designers map emergence profiles, contacts, and occlusal anatomy with surgical accuracy before generating CAM-ready milling output.",
      metric: "12-Micron Margin Line Tolerance",
      features: [
        "Certified for Exocad DentalCAD, 3Shape & Dental Wings",
        "Dual-pass verification for contact points and cement gap"
      ],
      image: "./img/banners/banner-precision-cad.webp",
      imageAlt: "WorkDent 12-Micron CAD Margin Verification"
    },
    {
      idx: 2,
      badge: "Clinical Workflow 03",
      title: "Elastic Milling & 3D Print Production for Dental Labs",
      desc: "Eliminate bottleneck constraints during seasonal surges. Outsource complex implant bars, hybrid dentures, and zirconia bridge CAD to vetted specialists.",
      metric: "99.4% First-Pass Milling Fit",
      features: [
        "Scale production capacity on-demand without overhead",
        "Specialist matching for complex all-on-X and hybrid bars"
      ],
      image: "./img/banners/banner-lab-prosthetics.webp",
      imageAlt: "WorkDent Dental Laboratory Milling and Prosthetics"
    },
    {
      idx: 3,
      badge: "Clinical Workflow 04",
      title: "Chairside Fit Guarantee With Escrow Payment Protection",
      desc: "Inspect every facet in our browser-based 3D STL viewer before approving design release. Funds remain safely in escrow until you are 100% satisfied.",
      metric: "100% Escrow Protection Guaranteed",
      features: [
        "Interactive 3D rotation, section slicing, and color mapping",
        "Dispute mediation and free revisions on clinical adjustments"
      ],
      image: "./img/banners/banner-restoration.webp",
      imageAlt: "WorkDent Restorative Precision and Chairside Fit Guarantee"
    }
  ];

  let currentBannerIdx = 0;
  let timerId = null;
  let isBannerVisible = false;
  let isInteracting = false;
  let resumeTimer = null;

  function updateBanner(idx) {
    if (idx < 0) idx = BANNERS.length - 1;
    if (idx >= BANNERS.length) idx = 0;
    currentBannerIdx = idx;

    const data = BANNERS[idx];

    // Update Tab Buttons
    const tabs = document.querySelectorAll('.wd-banner-tab');
    tabs.forEach((tab, i) => {
      const dot = tab.querySelector('span.size-2');
      if (i === idx) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        if (dot) {
          dot.classList.remove('bg-slate-300');
          dot.classList.add('bg-blue-600');
        }
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
        if (dot) {
          dot.classList.remove('bg-blue-600');
          dot.classList.add('bg-slate-300');
        }
      }
    });

    // Update Content
    const badgeEl = document.getElementById('banner-badge');
    const titleEl = document.getElementById('banner-title');
    const descEl = document.getElementById('banner-desc');
    const metricEl = document.getElementById('banner-metric');
    const imgEl = document.getElementById('banner-image');
    const featEl = document.getElementById('banner-features');

    if (badgeEl) badgeEl.textContent = data.badge;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (metricEl) metricEl.textContent = data.metric;

    if (featEl) {
      featEl.innerHTML = data.features.map(f => `
        <div class="flex items-center gap-2">
          <span class="text-blue-400 font-bold">&check;</span>
          <span>${f}</span>
        </div>
      `).join('');
    }

    if (imgEl) {
      imgEl.style.opacity = '0.4';
      setTimeout(() => {
        imgEl.src = data.image;
        imgEl.alt = data.imageAlt;
        imgEl.style.opacity = '1';
      }, 150);
    }
  }

  function nextBanner() {
    updateBanner(currentBannerIdx + 1);
  }

  function prevBanner() {
    updateBanner(currentBannerIdx - 1);
  }

  function startTimer() {
    stopTimer();
    if (isBannerVisible && !isInteracting) {
      timerId = setInterval(nextBanner, 5000);
    }
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function pauseAutoProgression() {
    isInteracting = true;
    stopTimer();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isInteracting = false;
      startTimer();
    }, 10000);
  }

  function init() {
    const tabs = document.querySelectorAll('.wd-banner-tab');
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        pauseAutoProgression();
        updateBanner(i);
      });
    });

    const prevBtn = document.getElementById('banner-prev');
    const nextBtn = document.getElementById('banner-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        pauseAutoProgression();
        prevBanner();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        pauseAutoProgression();
        nextBanner();
      });
    }

    // Viewport IntersectionObserver
    const showcaseSection = document.getElementById('clinical-showcase');
    if (showcaseSection && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isBannerVisible = entry.isIntersecting;
          if (isBannerVisible) {
            startTimer();
          } else {
            stopTimer();
          }
        });
      }, { threshold: 0.2 });

      observer.observe(showcaseSection);
    } else {
      isBannerVisible = true;
      startTimer();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
