# WorkDent — Product Requirements Document (PRD)
## The Professional Network for Dental Work
**Tagline:** *Connect. Work. Grow.*

---

## 1. Executive Summary
**WorkDent** is the dedicated professional and business network for the global dental industry. Rather than a generic job board or a single-page dashboard, WorkDent unifies dental technicians, dental laboratories, clinical dentists, CAD/CAM designers, dental manufacturers, and milling centers into a high-trust digital ecosystem.

### Core Value Pillars
1. **Find Work & Outsource Seamlessly**: Lab-to-lab overflow, freelance CAD/CAM design (exocad, 3Shape), and specialized clinic cases.
2. **Knowledge & Community**: A peer-reviewed clinical feed for CAD/CAM troubleshooting, material recommendations (Zirconia, PMMA, Titanium), and scan strategies.
3. **Verified Identity & @Username System**: Permanent unique handles (e.g. `@rahul_cadcam`, `@apex_lab`) with multi-tier verification badges:
   - 🟢 **Verified Technician**
   - 🔵 **Verified Dental Laboratory**
   - 🟣 **Verified Dentist / Clinic**
   - 🟠 **Verified Manufacturer / Company**
4. **Marketplace & Case Gallery**: Equipment, materials, and clinical portfolios with in-browser 3D STL inspection and escrow-protected deals.
5. **Secure Authentication & Session Infrastructure**: Unified Login/Signup switcher, Google OAuth, Passwordless Email OTP, client/session Rate Limiting (anti-brute-force), and 3-Day Persistent Cookie sessions.

---

## 2. Information Architecture & Routing

| Route | Page | Primary Objective | Key Features |
|---|---|---|---|
| `/` | **Home** | Brand introduction, trust proof & ecosystem entry | Hero, Community preview, Job cards, Member highlights, VIP teaser, universal glass navbar |
| `/community` | **Community** | Social discussion, case Q&A & troubleshooting | Category filtering (CAD/CAM, Lab, Tech, Troubleshooting), post creator, likes, comments, bookmarking |
| `/jobs` | **Find Work & Jobs** | Dental job marketplace & freelance dispatch | Search & filters (CAD Designer, Tech, Lab, Remote, Full-time, Freelance), job posting modal, instant apply |
| `/members` | **Members Directory** | Searchable professional networking | Filter by role (Technician, Lab, Dentist, Designer, Company), search by name or `@username`, Connect / Message |
| `/gallery` | **Case Gallery** | Visual portfolio of clinical cases | Before & After clinical sliders, software tags (exocad, 3Shape), material metadata, like & share |
| `/marketplace` | **Marketplace** | Dental equipment, materials & services | Category filters (Milling, 3D Printers, Scanners, Zirconia, Software, CAD Services), seller profiles, inquire modal |
| `/profile` | **User Profile** | Personal & business identity page | Header with avatar, @username, verification badge, bio, skills, software, portfolio cases, ratings & reviews |
| `/membership` | **VIP Membership** | Monetization & premium professional tiers | WorkDent Free vs WorkDent VIP ⭐ (featured listings, VIP badge, advanced networking, Stripe-ready) |
| `/auth/login` | **Unified Auth** | Sign In / Sign Up with smooth switch | Tab switcher, Google OAuth, Email/Password, Passwordless OTP, Rate Limiting, 3-Day persistent cookies |
| `/auth/register`| **Unified Auth** | Sign Up with role card selection | Role selection cards (Dentist, CAD Designer, Dental Lab), instant validation, OTP progression |
| `/auth/register/verify` | **OTP Verification** | 6-box split OTP verification | Auto-advance digit boxes, paste handling, 60s resend timer, 3-day cookie issue |

---

## 3. UI/UX Design System Specifications (`/ui-ux-pro-max`)

### 3.1 Visual Palette & Tokens
- **Background**: `#F8FAFC` (soft modern slate) with subtle radial mesh gradient (`rgba(37,99,235,0.06)`)
- **Primary Brand**: `#2563EB` (Royal Dental Blue)
- **Primary Hover**: `#1D4ED8`
- **Secondary Accent**: `#0284C7` (Sky Blue) & `#059669` (Clinical Emerald)
- **Card Surface**: Glassmorphic `#FFFFFF` with `backdrop-filter: blur(16px)`, `border: 1px solid #E2E8F0`, and refined depth `box-shadow: 0 10px 30px -10px rgba(15,23,42,0.06)`
- **Typography**: `Plus Jakarta Sans`, 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold), 800 (extra-bold)
- **High-Contrast Text**: `#0F172A` (Headings, WCAG AAA compliant), `#334155` (Body), `#64748B` (Muted labels)

### 3.2 Floating Glassmorphism Navbar
- Translucent surface: `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);`
- Clean brand mark: `WorkDent` with `Dent` highlighted in blue (zero arbitrary icon boxes).
- Active navigation states with rounded pill hover transitions.
- Fully accessible mobile drawer toggle with smooth slide/fade.

---

## 4. Technical Architecture & Security Specifications

### 4.1 Security Rate Limiting
- **Threshold**: Maximum 5 failed authentication attempts per 5-minute rolling window.
- **Cooldown**: 60-second lock with visual countdown timer on the submit button.
- **Notification**: High-visibility alert toast: `⚠️ Security rate limit active: Too many attempts. Please wait X seconds.`

### 4.2 3-Day Persistent Cookie Session
- **Cookie Name**: `workdent_auth_session`
- **Max-Age**: `259200` seconds (exactly 3 days).
- **Security Flags**: `SameSite=Lax`, `Path=/`, `Secure` over HTTPS.
- **Auto-Sync**: Checks expiration on route navigation; redirects smoothly to `/auth/login?expired=true` upon expiration.
- **Global Cookie Consent & Session Banner**: Subtle bottom banner notifying users of session persistence.

### 4.3 Supabase Backend Integration
- Auth methods: `signUp`, `signInWithPassword`, `signInWithOtp`, `signInWithOAuth` (Google).
- PostgreSQL database schemas for:
  - `profiles` (`id`, `username`, `full_name`, `role`, `verified_badge`, `bio`, `software`, `rating`)
  - `posts` (`id`, `user_id`, `category`, `title`, `content`, `likes_count`, `created_at`)
  - `jobs` (`id`, `poster_id`, `title`, `type`, `remote`, `software`, `budget`, `created_at`)
  - `marketplace_items` (`id`, `seller_id`, `title`, `category`, `price`, `image_url`)

---

## 5. Delivery Milestones
- [x] Phase 1: Architecture, PRD, Task Breakdown & Progress Tracking
- [x] Phase 2: Design System Core (`css/workdent-ui.css`) & Typography
- [x] Phase 3: Unified Auth (Switch System, Google Login, Rate Limiter, 3-Day Cookies)
- [x] Phase 4: Modern Homepage (`index.html`) with Community & Job Teasers
- [x] Phase 5: Dedicated Community Hub (`community.html`)
- [x] Phase 6: Dedicated Jobs & Work Portal (`jobs.html`)
- [x] Phase 7: Searchable Members Directory (`members.html`) with @usernames
- [x] Phase 8: Clinical Case Gallery (`gallery.html`) & 3D Viewer
- [x] Phase 9: Dental Marketplace (`marketplace.html`)
- [x] Phase 10: VIP Membership Page (`membership.html`)
- [x] Phase 11: Automated Verification, Responsive Audit & Git Remote Push
