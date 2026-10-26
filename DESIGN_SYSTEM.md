# WorkDent - Design System & UI Specification (DESIGN_SYSTEM.md)

**Aesthetic**: Modern Healthcare SaaS &bull; Clinical Precision &bull; High Contrast (WCAG AAA)  
**Strict Rule**: **0% Purple** &bull; Only Mint, Teal, Clinical Blue, Deep Navy, and White  

---

## 1. Color Palette Tokens

| Token Name | Hex Code | Clinical Application |
|---|---|---|
| `--wd-teal` | `#087F8C` | Primary brand accent, primary CTA buttons, active states |
| `--wd-teal-hover` | `#06646E` | Hover state for primary buttons |
| `--wd-teal-light` | `#E8F8F7` | Soft mint container backgrounds, badge surfaces |
| `--wd-accent` | `#36C9C0` | Turquoise highlights, secondary badges, active links |
| `--wd-mint` | `#B9F3E8` | Border accents, success tags, verified indicators |
| `--wd-blue` | `#2479D8` | Healthcare blue for links, secondary actions, case status |
| `--wd-blue-hover` | `#1B5EB0` | Blue hover state |
| `--wd-dark` | `#102A43` | Deep navy heading typography, maximum contrast text |
| `--wd-slate` | `#334E68` | Body paragraph text, secondary labels |
| `--wd-muted` | `#627D98` | Muted captions, form hints, placeholders |
| `--wd-bg-soft` | `#F5FAF9` | Off-white canvas background for page body |
| `--wd-card` | `#FFFFFF` | Surface color for cards, dropdowns, and modals |
| `--wd-border` | `#DCE8E8` | Crisp subtle borders separating sections |
| `--wd-footer-bg` | `#0D2030` | Deep clinical navy footer background |
| `--wd-footer-border` | `#1E3A52` | Footer dividing lines and subtle borders |

> [!IMPORTANT]
> **Zero Purple Discipline**: No `#8B5CF6`, `#7C3AED`, `#6366F1`, or Tailwind `purple-*` / `violet-*` / `indigo-*` classes may ever be introduced into WorkDent.

---

## 2. Typography

- **Primary Font**: `'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Wordmark Typography**: `Work` in Deep Navy (`#102A43`, font-weight: 800) + `Dent` in Dental Teal (`#087F8C`, font-weight: 800).
- **Headings**: Line height 1.15, crisp tracking tight, WCAG AAA contrast against white and light surfaces.

---

## 3. UI Components

- **Google-Style Avatar Dropdown**:
  - Circular avatar (Google photo or dual-color initial).
  - Floating profile card with user name, email, role badge, quick links, logout, and delete account.
- **Form Select Inputs**:
  - Native custom select dropdowns with chevron icons, replacing clunky cards.
- **Terms Agreement Checkbox**:
  - Clean checkbox (unchecked by default) with inline links to `/terms` and `/privacy` that do not accidentally toggle the box.
