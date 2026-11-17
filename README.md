# Workdent (`workdent.net`) — Dental CAD Marketplace

> **Dental CAD, designed by experts.**  
> Production-grade marketplace connecting **Dental Clinics (`DENTIST`)** and **Dental Laboratories (`LAB`)** with **Verified Dental CAD Designers (`DESIGNER`)**.

## 1. Quick Start & Demo Accounts

Run the development server:

```bash
npm install
npm run dev
```

On `/auth/login`, use the **1-Click Demo Accounts** card to sign in immediately:

| Role | Email | Password | Landing Route |
| :--- | :--- | :--- | :--- |
| **Dentist / Clinic** | `dentist@demo.workdent.net` | `Demo@1234` | `/dashboard` |
| **Dental Lab** | `lab@demo.workdent.net` | `Demo@1234` | `/dashboard` |
| **CAD Designer** | `designer@demo.workdent.net` | `Demo@1234` | `/designer/dashboard` |
| **Admin** | `admin@workdent.net` | `Demo@1234` | `/admin` |

- **Demo OTP Verification Code** (on `/auth/register` Step 4): `482913`
- **Promo Coupons** (on `/wallet`): `WELCOME25` ($25 promo credit), `DENTAL10`, `LABFIRST`, `GIFT50`

## 2. Design System — "Workdent Glass"
- **Typography**: `Bricolage Grotesque` (Display), `Geist` (UI, body, and tabular numbers — zero monospace fonts), `Big Shoulders Display` (Impact numbers), and `Newsreader` (Editorial quotes & legal).
- **Color Palette**: Aqua Brand (`#00BFA6`), 3-D Lime (`#CBFF4D` with `#9BC924` bottom edge), Gold Wallet (`#E9C46A`), Violet Studio Earnings (`#6C4DFF`).
- **Apple-Class Navigation**: Translucent `GlobalNav` with full-width `glass-3` Mega-Menus (`Services`, `Solutions`, `Resources`, `Company`), `⌘K` `SearchOverlay`, sticky `LocalNav`, collapsible 264px→76px Workspace `Sidebar`, and mobile floating `BottomTabs` with center `+` quick-action sheet.
