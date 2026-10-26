# WorkDent Supabase Backend & Multi-User Architecture

## 🚀 Overview
WorkDent is integrated with a production-ready Supabase backend featuring:
- **Multi-Role User System**: Dentist, CAD Designer, Dental Lab, Admin.
- **3-Day Persistent Cookie Session**: Valid for 72 hours (`Max-Age=259200`), auto-expires with re-login protection.
- **Password & Email OTP Authentication**: Passwordless one-time passcodes and password recovery.
- **Role-Based Portals & Access Guard**:
  - Dentist / Dental Practice (`/dashboard.html`)
  - CAD Designer Suite (`/designer/dashboard.html`, `/designer/earnings.html`, etc.)
  - Administrator Portal (`/admin.html`)
- **Case / Project & Escrow Engine**: Post cases with scan files, calculate pricing, and manage revisions.
- **Vercel Zero-Config Deployment**: Clean URL routing and automatic rewrites in `vercel.json`.

---

## 🗄️ Database Schema & RLS Setup
Run the SQL migration in your Supabase SQL Editor:
👉 [`supabase/migrations/20261026000000_workdent_core_schema.sql`](supabase/migrations/20261026000000_workdent_core_schema.sql)

### Tables Included:
1. `public.profiles` — User profile, role badge, hourly rate, rating.
2. `public.projects` — Dental cases, scan/design files, status, escrow payment.
3. `public.messages` — Direct collaboration messages between clinic and designer.
4. `public.wallets` — Designer balance, pending escrow, total payouts.
5. `public.referrals` — Affiliate codes and commission credits.

---

## 🍪 3-Day Cookie System
Cookies are set with `SameSite=Lax; Max-Age=259200`:
- **Active Session**: User remains logged in across pages for 3 days.
- **After 3 Days**: Session expires automatically; user is redirected to `/auth/login.html?expired=true` with a re-login notice.

---

## ☁️ Vercel Deployment Guide
1. Push this repository to GitHub: `git push origin main`
2. Import project in [Vercel](https://vercel.com/new).
3. Set Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
4. Deploy! `vercel.json` automatically manages clean URLs and security headers.
