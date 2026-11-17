# Workdent (`workdent.net`) — Production Backend & Infrastructure Blueprint

## 1. Architecture Overview
- **Frontend**: React + TypeScript + Vite ("Workdent Glass" Design System) hosted on `https://workdent.net`.
- **API Gateway**: `https://api.workdent.net/api` (Node.js / Fastify / Express + PostgreSQL + S3/R2 Presigned Storage).
- **Video Consultation Service**: `https://meet.workdent.net` (WebRTC SFU with pre-call hardware diagnostics and `.ics` calendar sync).
- **Environment Toggle**: Switch between `VITE_API_MODE=mock` (in-browser deterministic seed + Express mock server) and `VITE_API_MODE=live` without changing UI components.

## 2. Core PostgreSQL Schema
- `users`: `(id, full_name, email, role, timezone, clinic_name, two_factor_enabled, referral_code, status)`
- `designer_profiles`: `(id, user_id, headline, cad_software[], rating, completed_cases, availability, is_verified)`
- `services`: `(id, designer_id, catalog_id, name, category, price, turnaround_hours, revisions_included)`
- `staged_files`: `(id, owner_id, name, size, mime, ext, status, scan_status, s3_key, sha256)`
- `projects`: `(id, code, title, status, client_id, designer_id, service_id, teeth[], shade, material, total_amount, platform_fee, payment_intent_id)`
- `wallet_entries`: `(id, user_id, kind, direction, amount, balance_after, title, source, expires_at, project_id)`
- `appointments`: `(id, designer_id, client_id, project_id, type, starts_at, ends_at, timezone, status, meeting_url)`
- `webhooks` & `api_keys`: HMAC-SHA256 signed event delivery (`project.created`, `project.delivered`, `payment.released`).
