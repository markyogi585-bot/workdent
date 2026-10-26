# WorkDent — Dental CAD/CAM Network

![WorkDent Dental Network Logo](./WorkDent%20Dental%20Network%20Logo.png)

**WorkDent** (https://workdent.net) is an enterprise-grade digital dental network connecting dental practices, clinics, and laboratories with elite, verified CAD designers worldwide.

---

## 🌟 Key Features

1. **Complete Dental Ecosystem**:
   - 🦷 **Dentist Portal**: Practice workspace to submit intraoral scans (STL, PLY, OBJ), order restorations, and track turnaround.
   - 📐 **CAD Designer Workspace**: Specialist tools for exocad & 3Shape technicians, steady cases, and escrow protection.
   - 🏭 **Dental Lab Production Center**: Scaling digital milling capacity with verified technicians.

2. **Official Branding & Design System (`ui-ux-pro-max`)**:
   - Official 4D WorkDent Dental Network Logo in high resolution across all headers, footers, portals, and auth screens.
   - Clinical color tokens: Medical Deep Slate (`#0B132B`, `#0F172A`), Clinical Cyan (`#0284c7`), and Emerald Trust (`#059669`).
   - Accessible typography pairing (`Plus Jakarta Sans` + `Figtree` + `Noto Sans`).
   - Zero horizontal overflow across mobile (320px–430px) and ultra-wide desktops.

3. **Active Video & Media Integration**:
   - Real 1080p/4K dental footage embedded across the Homepage Hero, Clinical Showcase, Dentist Workflow, Designer Hub, and Lab Milling sections.
   - 57 dental videos and 22 high-res clinical photos organized in `/assets/videos/` and `/assets/photos/`.

4. **Authentication & Session Security**:
   - 3-Way Role Switcher with instant dynamic route mapping.
   - Google Sign-In ("Continue with Google") alongside secure credentials.
   - 3-Day (`72h`) auto-logout cookie session system (`workdent_session`).

---

## 🚀 Running Locally

```bash
# Using Python built-in server (configured with SPA fallback & video streaming)
python3 server.py

# Or using Node.js / any static server
npx serve . -p 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

```
├── 4D WorkDent Dental Network Logo.png
├── WorkDent Dental Network Logo.png
├── index.html
├── how-it-works.html
├── designers.html
├── find-designers.html
├── dashboard.html
├── app-engine.js
├── workdent-pro.css
├── server.py
├── as/
│   ├── dentist.html
│   ├── designer.html
│   └── lab.html
├── auth/
│   ├── login.html
│   ├── register.html
│   └── forgot.html
├── designer/
│   ├── dashboard.html
│   ├── earnings.html
│   ├── projects.html
│   └── messages.html
├── admin.html
└── assets/
    ├── branding/
    ├── photos/
    └── videos/
```

---

## 🔒 License & Copyright
© 2026 WorkDent Dental Network. All rights reserved.
Primary Domain: [https://workdent.net](https://workdent.net)
