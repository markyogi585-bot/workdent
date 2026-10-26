# WorkDent Implementation Tasks (`task.md`)

- [x] **Task 1: Project Architecture & Documentation** <!-- id: 1 -->
  - [x] Create PRD (`prd.md`) with dental network specs <!-- id: 1.1 -->
  - [x] Create Task plan (`task.md`) <!-- id: 1.2 -->
  - [x] Create Progress report (`progress.md`) <!-- id: 1.3 -->

- [x] **Task 2: Core Design System & Styling Tokens** <!-- id: 2 -->
  - [x] Integrate `/ui-ux-pro-max` Glassmorphism tokens into `css/workdent-ui.css` <!-- id: 2.1 -->
  - [x] Plus Jakarta Sans typography, high-contrast WCAG AAA variables <!-- id: 2.2 -->
  - [x] Unified button styles, glass cards, badges, and input elements <!-- id: 2.3 -->

- [x] **Task 3: Unified Authentication with Switch, Google Login & Rate Limiter** <!-- id: 3 -->
  - [x] Create unified Auth page (`auth/login.html` & `auth/register.html`) with interactive sliding switch <!-- id: 3.1 -->
  - [x] Implement Google Login (`Continue with Google`) with official Google brand mark <!-- id: 3.2 -->
  - [x] Implement Passwordless Email OTP & Password mode toggling <!-- id: 3.3 -->
  - [x] Implement Security Rate Limiter (5 attempts limit, 60s cooldown countdown) <!-- id: 3.4 -->
  - [x] Implement 3-Day Persistent Cookie Auth (`workdent_auth_session`) <!-- id: 3.5 -->
  - [x] Create 6-box split OTP verification page with paste support & resend timer <!-- id: 3.6 -->

- [x] **Task 4: Dedicated Dental Network Pages** <!-- id: 4 -->
  - [x] Update Homepage (`index.html`) with clean dental network layout <!-- id: 4.1 -->
  - [x] Create Community Hub (`community.html`) with CAD/CAM & Lab categories, posts, likes <!-- id: 4.2 -->
  - [x] Create Jobs & Work Marketplace (`jobs.html`) with search, filter & post-job modal <!-- id: 4.3 -->
  - [x] Create Members Directory (`members.html`) with @usernames, verification badges & connect <!-- id: 4.4 -->
  - [x] Create Case Gallery (`gallery.html`) with before/after case showcases & software tags <!-- id: 4.5 -->
  - [x] Create Dental Marketplace (`marketplace.html`) with equipment, materials & services <!-- id: 4.6 -->
  - [x] Create VIP Membership page (`membership.html`) with Free vs VIP ⭐ comparison <!-- id: 4.7 -->
  - [x] Create User Profile page (`profile.html`) with @username, verified badge & portfolio <!-- id: 4.8 -->

- [x] **Task 5: Vercel Routing & Cookie Consent Banner** <!-- id: 5 -->
  - [x] Update `vercel.json` rewrites for all dedicated pages <!-- id: 5.1 -->
  - [x] Add global 3-Day Cookie consent & session banner <!-- id: 5.2 -->

- [x] **Task 6: Automated Verification & Git Remote Sync** <!-- id: 6 -->
  - [x] Playwright verification across all new pages and auth flows <!-- id: 6.1 -->
  - [x] Viewport responsiveness test (360px to 1920px) with 0 overflow <!-- id: 6.2 -->
  - [x] Stage, commit, and push to GitHub remote (`main`) <!-- id: 6.3 -->
