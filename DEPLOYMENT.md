# WorkDent - Production Deployment Guide (DEPLOYMENT.md)

## 1. Hosting Architecture

WorkDent is designed for **instant, zero-config static edge deployment**:
- Compatible with GitHub Pages, Cloudflare Pages, Vercel, Netlify, AWS S3 + CloudFront, or any Nginx / Caddy static web server.
- No build step required (`npm run build` is unnecessary because all HTML, CSS, and JS run natively in browser engines).

---

## 2. GitHub Deployment (Current Production)

- **Repository**: `https://github.com/markyogi585-bot/workdent.git`
- **Branch**: `main`

### Deployment Steps:
```bash
cd /root/workdent
git add .
git commit -m "feat: complete healthcare UI, Google avatar navbar, onboarding wizard, terms consent & design system"
git push origin main
```

---

## 3. Environment Variables (Optional Supabase Remote Sync)

If connecting to a custom Supabase instance, inject in `window`:
```html
<script>
  window.WORKDENT_SUPABASE_URL = "https://your-supabase-project.supabase.co";
  window.WORKDENT_SUPABASE_KEY = "your-public-anon-key";
</script>
```
If omitted, WorkDent automatically runs in zero-latency encrypted cookie mode.
