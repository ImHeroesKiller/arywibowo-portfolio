# arywibowo-portfolio

Portfolio website for **Ary Wibowo** — Profesional Consultant.

Built with Next.js 14, TypeScript, Tailwind CSS v4, shadcn/ui, and Framer Motion.

**Live site:** [https://arywibowo-portfolio.vercel.app](https://arywibowo-portfolio.vercel.app)  
**Custom domain (when DNS is ready):** [https://arywibowo.co.id](https://arywibowo.co.id)

---

## Features

- Dark theme (`#111` background, `#3b82f6` accent)
- Responsive layout with mobile-first Hero
- Pages: Home, About, Services, Projects, Contact
- Smooth page animations (Framer Motion)
- Deploy-ready for Vercel

---

## Requirements

- Node.js 18+
- npm

---

## Run Locally

```bash
# Clone
git clone https://github.com/ImHeroesKiller/arywibowo-portfolio.git
cd arywibowo-portfolio

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Clean dev start (if you see 404 on CSS/JS)

Stale `.next` cache can cause 404 errors after restarts. Use:

```bash
npm run dev:clean
```

Then open a **new browser tab** (do not refresh an old tab) and hard-refresh with `Cmd + Shift + R`.

---

## Build & Lint

```bash
npm run build
npm run lint
```

---

## Deploy to Vercel

### Option A — GitHub import (recommended)

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import `ImHeroesKiller/arywibowo-portfolio`.
4. Framework is auto-detected as **Next.js**.
5. Click **Deploy** (no env vars required for the base setup).

### Option B — Vercel CLI

```bash
npx vercel login
npx vercel --prod
```

### Custom domain `arywibowo.co.id`

1. In Vercel project → **Settings** → **Domains** → Add `arywibowo.co.id` and `www.arywibowo.co.id`.
2. At your DNS provider, add the records Vercel shows (typically):
   - `A` record → `76.76.21.21`
   - `CNAME` for `www` → `cname.vercel-dns.com`
3. Wait for DNS propagation, then confirm in Vercel.

---

## Project Structure

```
app/              # Pages (App Router)
components/       # UI components (Hero, Navbar, Footer, etc.)
components/ui/    # shadcn/ui primitives
lib/              # constants, utils
public/images/    # profile.png, awi-logo.png
```

---

## Configuration

Edit site content in `lib/constants.ts`:

- Name, title, tagline, email
- Services list
- Social links (GitHub, LinkedIn)

---

## License

Private portfolio project. All rights reserved.