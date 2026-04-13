# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**VietMy SSU Call Center** — A full-stack production-ready website and CMS for a Vietnamese Call Center company.

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend**: NestJS + TypeORM + PostgreSQL
- **i18n**: Vietnamese (VI) and English (EN) via `next-intl`
- **Admin**: Custom admin panel at `/admin` (no separate `/vi` or `/en` prefix)

---

## Development Commands

### Backend (NestJS)

```bash
cd backend

# Install
npm install

# Copy env
cp .env.example .env   # then fill in DB credentials

# Start dev server (port 3001)
npm run start:dev

# Seed database with sample data
npm run seed

# Build for production
npm run build
npm run start:prod
```

### Frontend (Next.js)

```bash
cd frontend

# Install
npm install

# Copy env
cp .env.local.example .env.local   # then fill in keys

# Start dev server (port 3000)
npm run dev

# Type check
npm run type-check

# Build
npm run build
```

### Docker (full stack)

```bash
# From root — starts postgres, redis, backend, frontend
cp .env.example .env
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Architecture

### Folder Structure

```
VietMySSU-WebsiteDemo/
├── backend/                   # NestJS API (port 3001)
│   └── src/
│       ├── auth/              # JWT + 2FA login
│       ├── users/             # User CRUD
│       ├── roles/             # Roles + Permissions (RBAC)
│       ├── posts/             # News/blog (public + admin endpoints)
│       ├── jobs/              # Job listings + applications
│       ├── categories/        # Categories for posts
│       ├── contact/           # Contact form submissions
│       ├── menu/              # Header/footer menu items
│       ├── audit/             # Audit log (all user actions)
│       ├── analytics/         # Dashboard stats + charts
│       ├── common/
│       │   ├── guards/        # JwtAuthGuard, PermissionsGuard
│       │   └── decorators/    # @Permissions(), @Public()
│       ├── config/            # configuration.ts (maps .env vars)
│       └── database/
│           ├── database.module.ts
│           └── seeds/seed.ts  # Run with `npm run seed`
│
├── frontend/                  # Next.js 14 (port 3000)
│   ├── messages/
│   │   ├── vi.json            # Vietnamese translations
│   │   └── en.json            # English translations
│   └── src/
│       ├── app/
│       │   ├── [locale]/      # Public pages (vi/en)
│       │   │   ├── page.tsx   # Home (all sections)
│       │   │   ├── news/      # News list + [slug] detail
│       │   │   ├── jobs/      # Jobs list + [id] detail + apply form
│       │   │   ├── contact/   # Contact form with branch selector
│       │   │   └── services/[slug]/  # Service detail pages
│       │   └── admin/         # CMS (no locale prefix)
│       │       ├── login/     # Login + 2FA
│       │       ├── page.tsx   # Dashboard with charts
│       │       ├── posts/     # News CRUD
│       │       ├── jobs/      # Job CRUD + applications
│       │       ├── users/     # User management
│       │       ├── roles/     # Roles & permissions
│       │       ├── contact/   # Contact submissions
│       │       ├── analytics/ # Analytics charts
│       │       └── audit-logs/# Audit trail
│       ├── components/
│       │   ├── layout/        # Header, MegaMenu, Footer
│       │   ├── home/          # HeroSection, AboutSection, ServicesSection,
│       │   │                  # WhyChooseUs, FeaturedJobs, ClientLogos,
│       │   │                  # NewsSection, CTASection
│       │   ├── news/          # NewsListPage, NewsDetailClient
│       │   ├── jobs/          # JobsListPage, JobDetailClient (with apply form)
│       │   └── contact/       # ContactPageClient
│       ├── lib/
│       │   ├── api.ts         # Axios instance + all API calls
│       │   ├── auth.ts        # Token helpers, getUser(), hasPermission()
│       │   └── utils.ts       # cn(), slugify(), formatDate(), getLocalizedField()
│       ├── i18n.ts            # next-intl config
│       └── middleware.ts      # Locale routing middleware
│
└── docker-compose.yml
```

---

## Key Patterns

### API Architecture

- **Public endpoints**: `GET /api/v1/posts`, `GET /api/v1/jobs`, `POST /api/v1/contact`
- **Admin endpoints**: `GET /api/v1/admin/posts` (JWT required + permission check)
- **Auth flow**: `POST /auth/login` → if 2FA enabled returns `{ requiresTwoFa: true, tempToken }` → `POST /auth/2fa/verify`
- **Refresh flow**: On 401, axios interceptor in `lib/api.ts` auto-calls `POST /auth/refresh`

### RBAC (Role-Based Access Control)

- Permissions follow `resource:action` format: `posts:create`, `users:delete`, etc.
- Resources: `posts`, `jobs`, `users`, `roles`, `categories`, `contact`, `menu`, `audit`, `analytics`
- `super_admin` role bypasses all permission checks in `PermissionsGuard`
- Use `@Permissions('posts:create')` decorator on controllers

### i18n Routing

- All public pages live under `src/app/[locale]/` → `/vi/...` and `/en/...`
- `middleware.ts` handles locale detection and redirection
- Use `getLocalizedField(obj, 'title', locale)` from `lib/utils.ts` to pick `title` vs `titleEn`
- Admin panel at `/admin` does NOT use locale routing

### Entities with bilingual fields

Most entities (Post, Job, Category, MenuItem) have `field` + `fieldEn` columns for bilingual content. The `getLocalizedField()` utility handles locale-aware selection.

---

## Database

### Default seed credentials

- Admin: `admin@vietmy.com` / `Admin@123` (role: super_admin)
- Editor: `editor@vietmy.com` / `Editor@123` (role: editor)

### Schema overview

| Table | Purpose |
|---|---|
| users | Admin users with hashed passwords + 2FA secret |
| roles | Named roles (super_admin, editor, ...) |
| permissions | Fine-grained `resource:action` permissions |
| role_permissions | Many-to-many join |
| posts | News/blog articles (bilingual) |
| jobs | Job listings (bilingual) |
| job_applications | Application submissions |
| categories | Categories for posts |
| contact_submissions | Contact form data |
| audit_logs | User action log with `oldData`/`newData` JSONB |
| menu_items | Self-referencing tree for header/footer menus |

---

## Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `DB_HOST/PORT/NAME/USER/PASS` | PostgreSQL connection |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Access token (default 15m) |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRES_IN` | Refresh token (default 7d) |
| `TWO_FA_APP_NAME` | App name shown in authenticator |
| `DB_SYNC=true` | Auto-sync TypeORM schema (disable in production) |

### Frontend `.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | For Google Maps embed |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | For contact form CAPTCHA |

---

## Deployment

```bash
# Production build (backend)
cd backend && npm run build && node dist/main

# Production build (frontend)
cd frontend && npm run build && npm start

# Or Docker
docker-compose up -d
```

Set `DB_SYNC=false` in production and run migrations manually instead of relying on TypeORM `synchronize`.
