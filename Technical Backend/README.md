# Nnergix Sentinel Solar – Clickable MVP Website

> **What this is:** a fully functioning, front-end-only prototype of **Sentinel Solar** by Nnergix: a no-hardware forecasting and monitoring platform for rooftop solar.
> It is the MVP referenced in the strategy proposal *"Project Prism – BCG x Nnergix"*. It runs entirely on **simulated demo data**, is hosted from a **GitHub repository** and deployed via **Vercel**.
>
> **Instructions for Claude Code:** read this whole file before writing any code. Follow the build plan in section 12 step by step, and check each step against its acceptance criteria before moving on. When something is unclear, choose the simplest option that keeps the site clean and fast.

---

## Table of contents
1. Goals of the prototype
2. Users and what each must be able to do
3. Tech stack
4. Repository structure
5. Design system (Nnergix brand, Tacto-style layout)
6. Site map and routes
7. Page-by-page specification
8. Demo data model and generator
9. Measurement: testing the three open questions
10. Copy and content rules
11. Accessibility, responsiveness and performance
12. Build plan with acceptance criteria
13. GitHub + Vercel deployment
14. Out of scope
15. Disclaimer text

---

## 1. Goals of the prototype

The prototype has two jobs:

1. **Show** the product: a reader of the proposal clicks a link and sees in under a minute what Sentinel Solar does for homeowners, energy retailers and installers.
2. **Test** the three open questions behind Sentinel Solar, with real clicks from real visitors:
   - **Who pays?** Homeowner, energy retailer or installer?
   - **For what?** Forecasts, health monitoring/maintenance, or a branded dashboard for customer loyalty?
   - **Which channel?** Bought directly by the homeowner, or provided through a retailer/installer?

Everything a visitor does that answers one of these questions is tracked (section 9).

**Product principles (from Nnergix's situation):**
- No hardware: data comes from the inverter's software interface (API), with the owner's consent.
- Fully automated: no hands-on work by Nnergix per rooftop.
- Built on Nnergix's existing strengths: machine-learning production forecasts and extreme-weather alerts (Sentinel Weather).

---

## 2. Users and what each must be able to do

| User | Their need | Must be able to do in the prototype |
|---|---|---|
| **Homeowner with solar panels** ("prosumer") | Know what the panels produce, use more of their own power, keep the system healthy | See today's production and 7-day forecast, actual vs expected, health status, best hours to use power, savings, weather alerts |
| **Energy retailer** (e.g. a utility that sells/manages many rooftop systems) | Forecast production of many small systems when buying energy; plan maintenance; keep customers loyal | See a portfolio of ~250 rooftops on a map, total forecast, alerts ranked by expected loss, maintenance list, preview the homeowner app in its own brand |
| **Installer** | Monitor many rooftops with different inverter brands from one place; spot faults early | Same portfolio view, filtered to maintenance: offline/underperforming systems, open tasks |
| **Later (shown as "coming soon" only)** | Flexibility aggregators, grid operators | Nothing interactive; one teaser card each |

---

## 3. Tech stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (design tokens as CSS variables, see section 5)
- **React Router v6** (client-side routing; Vercel rewrite in section 13)
- **Recharts** for all charts
- **react-leaflet + Leaflet** with CARTO "Positron" light tiles for the map (clean, grey; include the required attribution)
- **lucide-react** for icons (thin, 1.5px stroke)
- **framer-motion** for subtle fade/slide-in on scroll (respect `prefers-reduced-motion`)
- No backend, no database, no accounts. State lives in React context + `localStorage`.
- Package manager: `npm`. Node 18+.

Scripts in `package.json`: `dev`, `build`, `preview`, `lint`, `typecheck`.

---

## 4. Repository structure

```
sentinel-solar-mvp/
├─ README.md                 ← this file
├─ index.html
├─ vercel.json               ← SPA rewrite
├─ package.json
├─ tailwind.config.ts
├─ postcss.config.js
├─ tsconfig.json
├─ public/
│  ├─ favicon.svg
│  └─ og-image.png           ← 1200×630, clean product shot + headline
└─ src/
   ├─ main.tsx
   ├─ App.tsx                ← routes
   ├─ styles/globals.css     ← CSS variables, base styles
   ├─ brand/tokens.ts        ← colours, radii, shadows (mirrors CSS vars)
   ├─ data/
   │  ├─ random.ts           ← seeded RNG (mulberry32)
   │  ├─ solar.ts            ← production model (clear-sky curve × weather)
   │  ├─ weather.ts          ← 7-day weather scenario
   │  ├─ household.ts        ← the demo home
   │  ├─ portfolio.ts        ← ~250 rooftops around Barcelona
   │  └─ inverters.ts        ← list of supported inverter brands (generic names)
   ├─ analytics/
   │  ├─ track.ts            ← track(event, props) → localStorage
   │  └─ events.ts           ← event names (typed)
   ├─ context/
   │  ├─ DemoContext.tsx     ← selected view, white-label on/off, date
   │  └─ BrandContext.tsx    ← white-label brand switch
   ├─ components/
   │  ├─ layout/ (Navbar, Footer, AppShell, Sidebar, PageHeader)
   │  ├─ ui/ (Button, Card, Badge, Tabs, Toggle, Stat, Eyebrow, Modal, Table, EmptyState, Tooltip)
   │  ├─ charts/ (ProductionChart, ForecastChart, PortfolioForecastChart, Sparkline)
   │  ├─ map/ (PortfolioMap)
   │  └─ marketing/ (Hero, LogoStrip, HowItWorks, AudienceTabs, BigStats, FeatureGrid, PricingTeaser, ClosingCta, DemoBanner)
   └─ pages/
      ├─ Landing.tsx
      ├─ Pricing.tsx
      ├─ DemoHub.tsx
      ├─ Connect.tsx
      ├─ app/Home.tsx         ← homeowner app
      ├─ app/Portfolio.tsx    ← retailer/installer
      ├─ app/SiteDetail.tsx
      ├─ app/Maintenance.tsx
      ├─ RequestPilot.tsx
      ├─ Insights.tsx         ← hidden measurement page
      └─ NotFound.tsx
```

---

## 5. Design system

### 5.1 Look and feel (inspiration: tacto.ai)
- **Super clean, enterprise-calm.** White background, lots of whitespace, very few colours.
- **Big, short headlines** (2–6 words), one idea per section.
- **Small uppercase eyebrow labels** above section titles (letter-spacing 0.08em, 12px, brand colour).
- **Oversized numbers** for key stats with a small uppercase caption underneath.
- **Flat product screenshots** (actual app components rendered inside rounded cards) instead of stock images or device frames.
- **One primary action** repeated across the site: **"Request a pilot"**. Secondary actions are text links with an arrow (→).
- **Soft rounded cards** (radius 20px), no hard borders, no divider lines. Separation comes from whitespace and light grey surfaces.
- **Motion:** subtle fade-up on scroll (12px, 400ms, ease-out), staggered by 60ms. Never bouncy.
- **One dark section** maximum on the landing page (the "How it works" or closing CTA), using the darkest brand colour.

### 5.2 Colours – Nnergix brand
> **TODO before building (step 0):** confirm the exact Nnergix brand colours from the logo on https://www.nnergix.com (screenshot → colour picker) and replace the hex values below. Keep the variable names unchanged.

Default tokens (use until confirmed):

```css
:root {
  /* Brand */
  --brand-900: #0B2E4F;   /* deep navy – headlines, dark section */
  --brand-700: #12507F;   /* primary – buttons, links, active states */
  --brand-500: #1F7AC0;   /* accent – charts (forecast line) */
  --brand-100: #E6F0F8;   /* tint – selected rows, pills */

  /* Energy accent (solar) */
  --sun-500:   #F5A524;   /* production bars / sun icon only */
  --sun-100:   #FEF3DC;

  /* Neutrals */
  --ink:       #111827;   /* body text strong */
  --text:      #4B5563;   /* body text */
  --muted:     #9CA3AF;   /* captions, axis labels */
  --surface:   #F5F6F8;   /* cards on white */
  --bg:        #FFFFFF;

  /* Status */
  --ok:        #16A34A;
  --warn:      #D97706;
  --alert:     #DC2626;
}
```

Rules:
- Max **one** accent colour per component. Sun yellow is used **only** for production/solar data.
- Charts: production = `--sun-500` bars or area; forecast = `--brand-500` line (dashed for future); expected = `--muted` dashed line.
- Status badges use soft backgrounds (10% tint) with coloured text, never solid red blocks.

### 5.3 Typography
- Font: **Inter** (Google Fonts, weights 400/500/600/700). Fallback: Helvetica, Arial, sans-serif.
- Scale: Display 64/72 (landing hero, -0.02em), H1 44/52, H2 32/40, H3 20/28, Body 16/26, Small 14/22, Caption 12/16 uppercase.
- Headlines in `--ink`, weight 600. Body in `--text`, weight 400.
- Numbers in stats use `font-variant-numeric: tabular-nums`.

### 5.4 Layout
- Max content width 1200px, side padding 24px (mobile 16px).
- Section vertical padding 120px desktop, 72px mobile.
- 12-column grid, gap 24px.
- Card: background `--surface` or white with shadow `0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)`, radius 20px, padding 24–32px.
- Buttons: radius 999px (pill), height 44px, primary = `--brand-700` bg / white text; secondary = white bg / `--ink` text / 1px `--surface` ring.

---

## 6. Site map and routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing | Explain Sentinel Solar in 60 seconds, route visitors to the demo |
| `/pricing` | Pricing | Willingness-to-pay test (who pays, for what) |
| `/demo` | Demo hub | "Who are you?" → homeowner / energy retailer / installer |
| `/connect` | Connect flow | Simulated inverter connection (3 steps) |
| `/app/home` | Homeowner app | Production, forecast, health, best hours, savings, alerts |
| `/app/portfolio` | Portfolio | Map + list of ~250 rooftops, total forecast, alerts |
| `/app/site/:id` | Site detail | One rooftop in detail (from portfolio) |
| `/app/maintenance` | Maintenance | Installer task list |
| `/pilot` | Request a pilot | Lead form (stored locally) |
| `/insights` | Insights (hidden, not linked) | Measurement results + CSV export |
| `*` | 404 | Friendly not-found with link home |

A thin **demo banner** sits at the top of every `/app/*` and `/connect` page: *"Demo with simulated data – no real systems are connected."* with a link back to `/demo`.

---

## 7. Page-by-page specification

### 7.1 Navbar (marketing pages)
- Left: Nnergix wordmark (text logo "nnergix" in `--brand-900`, weight 700, plus small "Sentinel Solar" label). Do **not** hotlink the real logo; recreate a simple text wordmark.
- Centre: Product · For homeowners · For retailers · For installers · Pricing (anchors on landing + `/pricing`).
- Right: "Try the demo" (text link) · **Request a pilot** (primary button).
- Sticky, white with blur on scroll, 1px bottom shadow only after scrolling.
- Mobile: hamburger → full-screen menu.

### 7.2 Landing page `/`
Sections in order:

1. **Hero**
   - Eyebrow: `SENTINEL SOLAR BY NNERGIX`
   - Headline: **"Every rooftop, forecast and monitored."**
   - Sub: "Production forecasts and health monitoring for rooftop solar. No hardware, no site visits – connected through the inverter in minutes."
   - Buttons: **Try the demo** (primary → `/demo`) · "Request a pilot →" (text link).
   - Right/below: a live, rendered screenshot card of the homeowner app (today's production chart + health badge), slightly tilted 0°, soft shadow. Use the real component with demo data, not an image.

2. **Logo/trust strip** – "Built on forecasting trusted by energy traders, grid operators and plant owners" with 5 neutral grey **placeholder** logo shapes labelled "Energy trader", "System operator", "Asset owner" etc. (no real third-party logos).

3. **Problem** – Eyebrow `THE PROBLEM`. Headline: "Millions of small solar systems. No one sees them." Three short cards:
   - Homeowners: "Don't know if their panels work as they should."
   - Retailers: "Must buy energy without knowing what their customers' roofs will produce."
   - Installers: "Check hundreds of roofs, each with a different inverter brand."

4. **How it works** (dark section, `--brand-900` background, white text) – Eyebrow `HOW IT WORKS`. Three numbered steps with small icons:
   1. **Connect** – "Link the inverter with the owner's consent. No hardware."
   2. **Forecast** – "Machine learning predicts production up to 7 days ahead, per rooftop."
   3. **Act** – "Get alerts, best hours to use power and maintenance tasks automatically."

5. **Audience tabs** – Eyebrow `ONE PLATFORM, THREE VIEWS`. Tabs: Homeowners · Energy retailers · Installers. Each tab: 3 bullet benefits on the left + a rendered component preview on the right + "See this view →" link into the right demo page. Track tab clicks (section 9).

6. **Big stats** – Three oversized numbers with captions. Use only defensible, non-invented framing:
   - `0` – "hardware to install"
   - `7 days` – "production forecast per rooftop"
   - `1 view` – "for every inverter brand"

7. **Feature grid** – 6 small cards with icon + title + one line: Production forecast · Health check · Best time to use power · Savings tracker · Storm & hail alerts · Maintenance list.

8. **Coming next** – two muted teaser cards: "Flexibility aggregators" and "Grid operators" – "Area-level forecasts for flexibility bids and grid planning. Coming soon."

9. **Pricing teaser** – "From EUR 10 per rooftop per year." + link "See pricing →".

10. **Closing CTA** – Big stacked headline: **"Small roofs. Big picture."** + **Request a pilot** button.

11. **Footer** – wordmark, short line "Sentinel Solar is a product concept by Nnergix, Barcelona.", link columns (Product, Demo, Pricing, Request a pilot), small disclaimer (section 15). No real legal pages needed; link "Privacy" to a short modal saying no personal data leaves the browser.

### 7.3 Demo hub `/demo`
- Headline: "Who are you?"
- Three large clickable cards with icon, title and one line:
  - **Homeowner** → `/app/home`
  - **Energy retailer** → `/app/portfolio?view=retailer`
  - **Installer** → `/app/maintenance?view=installer`
- Small link under cards: "First time? See how a system is connected →" (`/connect`).
- Track which card is chosen (channel/payer signal).

### 7.4 Connect flow `/connect` (simulated)
Three-step wizard with progress dots:
1. **Choose inverter brand** – grid of 8 generic brand tiles (`Inverter brand A … H`, plus "Other"). Do not use real manufacturer names or logos.
2. **Give consent** – checkbox "I allow Nnergix to read production data from my inverter. I can revoke this anytime." + "Connect" button.
3. **Connecting…** – animated progress (2.5s) → success state: "Connected. Your first forecast is ready." → button "Open my dashboard" → `/app/home`.
- If "Other" is chosen: show "We'll let you know when your brand is supported" + email field (stored locally) → tracked as demand signal.

### 7.5 App shell (`/app/*`)
- Left sidebar (collapsible on mobile → bottom tab bar): Home · Portfolio · Maintenance · Settings (Settings opens a modal only).
- Top bar: page title, date selector showing "Today" (fixed demo date), view switch pill ("Homeowner / Retailer / Installer").
- Content on white, cards on `--surface`.

### 7.6 Homeowner app `/app/home`
Layout: 12-col grid of cards.

1. **Greeting row** – "Good afternoon, Ramon" · address line "Rooftop 6.0 kWp · Barcelona" · health badge (`Working as expected` green / `Check your system` amber).
2. **Today** (large card)
   - Big number: kWh produced so far today + caption "of X kWh forecast".
   - Area chart: hourly production today (sun colour, solid until "now", then forecast as dashed brand line) + expected (muted dashed).
3. **Next 7 days** – bar chart of daily forecast kWh with weather icons (sun / partly cloudy / cloud / rain) above bars.
4. **Best time to use power** – card with a horizontal timeline 06:00–21:00 highlighting the best 3-hour window today and tomorrow. Copy: "Run the washing machine or charge the car between 12:00 and 15:00." Small "Remind me" toggle (tracked).
5. **Savings this month** – EUR saved and kg CO₂ avoided, with sparkline. Footnote "Demo values, assuming EUR 0.20/kWh."
6. **Alerts** – list: e.g. "Hail possible on Thursday 15:00–18:00. Consider checking your panels afterwards." (from Sentinel Weather). Dismissible.
7. **Health check** – actual vs expected for the last 30 days as a small line chart + plain-language verdict.
8. **Upsell / pay test** – subtle card: "Unlock 7-day forecasts and storm alerts – EUR 30/year" with buttons **"I'd pay for this"** and "Not now" (both tracked; clicking "I'd pay" shows a toast "Thanks – this is a prototype, nothing was charged.").

### 7.7 Portfolio `/app/portfolio` (retailer / installer)
1. **KPI row** (4 stats): Rooftops connected (≈250) · Total capacity (MWp) · Forecast tomorrow (MWh) · Systems needing attention (count, amber).
2. **Map** (left, 7 cols): Barcelona metro area, one dot per rooftop, colour by status (green ok / amber underperforming / red offline). Click → popover with site name, kWp, today's kWh, status, "Open site →".
3. **Portfolio forecast** (right, 5 cols): next 48h hourly total production (MWh) with uncertainty band (P10–P90 shaded). Caption: "Use this when buying energy for tomorrow."
4. **Alerts ranked by expected loss** – table: Site · Issue (Offline / Underperforming / Storm risk) · Since · Expected loss (kWh/day and EUR/day) · Action button ("Create task"). Sorted by loss desc. Rounded table rows, no grid lines.
5. **White-label preview** – toggle "Show homeowner app in your brand". When on: open a modal with the homeowner app rendered in a fictional retailer brand **"Sunvolt Energy"** (teal palette + text logo). Track toggle (signal: loyalty value).
6. **Export** button – "Download forecast (CSV)" → generates CSV from demo data (tracked).
- `?view=installer` changes default sort to maintenance issues and hides the energy-buying forecast caption.

### 7.8 Site detail `/app/site/:id`
- Header: site name, kWp, inverter brand (generic), install year, status badge.
- Charts: today hourly (actual vs expected), last 30 days daily, 7-day forecast.
- "Diagnosis" card in plain language, e.g. "Production is 18% below similar roofs nearby since 3 Oct. Likely cause: soiling or partial shading."
- Button: "Create maintenance task" → adds to Maintenance list (context + localStorage).

### 7.9 Maintenance `/app/maintenance`
- Kanban-style 3 columns (rounded cards, no lines): To do · Scheduled · Done. Drag-and-drop optional; buttons "Schedule" / "Mark done" are enough.
- Each task: site, issue, expected loss, created date.
- Filter chips: All · Offline · Underperforming · Storm check.

### 7.10 Pricing `/pricing` (willingness-to-pay test)
- Headline: "Simple pricing per rooftop."
- Toggle: **"I'm a homeowner" / "I manage many rooftops"** (tracked – who pays).
- Homeowner view – 3 tiers, per rooftop per year:
  - **Basic – EUR 10**: production monitoring, health check.
  - **Plus – EUR 30** (highlighted "Most chosen"): + 7-day forecast, best time to use power, storm & hail alerts.
  - **Pro – EUR 50**: + savings tracker, monthly report, one-click maintenance request.
- Portfolio view – same three tiers with "per rooftop, volume discounts from 1,000 rooftops" + extra row "White-label app for your customers" (Plus and Pro) + "API access" (Pro).
- Every "Choose plan" button → modal: "This is a prototype – nothing is charged. Would you like us to contact you about a pilot?" with "Yes, request a pilot" (→ `/pilot` prefilled with plan) and "No thanks". Track plan + audience.
- FAQ (4 questions, accordion): Do I need new hardware? Which inverters are supported? Who can see my data? Can I cancel anytime?

### 7.11 Request a pilot `/pilot`
- Form: Name, Company (optional), Role (Homeowner / Energy retailer / Installer / Aggregator / Grid operator / Other), Number of rooftops (select: 1, 2–50, 51–1,000, 1,000+), Most valuable feature (radio: Forecasts / Health & maintenance / Branded app for customers / Other), Email, Message.
- On submit: validate, store in localStorage, track event, show success screen "Thanks – we'll be in touch." No network request. (Optional later: Formspree endpoint via env var `VITE_FORM_ENDPOINT`; if unset, stay local.)

### 7.12 Insights `/insights` (hidden)
- Not linked anywhere; reachable by URL only.
- Shows counts per tracked event, grouped by the three questions (section 9), as simple bar charts + a raw event table.
- Buttons: "Export CSV", "Reset data".

---

## 8. Demo data model and generator

All data is generated **deterministically** from a fixed seed (`20191201`) so screenshots are reproducible. Fixed demo "today": **a sunny day in June** (choose `2025-06-18`, display as "Today"). Use the browser's local time only for the greeting.

### 8.1 Types
```ts
type Status = 'ok' | 'underperforming' | 'offline';
interface Site {
  id: string;            // "BCN-0001"
  name: string;          // "Gràcia · Carrer de Verdi 12" (fictional addresses)
  lat: number; lng: number;
  kWp: number;           // 5–20
  inverterBrand: string; // "Inverter brand A".."H"
  installYear: number;   // 2012–2019
  status: Status;
  perfRatio: number;     // actual/expected, 1.0 ok, 0.7–0.9 underperforming, 0 offline
  issueSince?: string;   // ISO date
}
interface HourPoint { hour: number; actualKwh?: number; expectedKwh: number; forecastKwh?: number; p10?: number; p90?: number }
interface DayForecast { date: string; kwh: number; weather: 'sun'|'partly'|'cloud'|'rain'; stormRisk?: boolean }
```

### 8.2 Production model (`solar.ts`)
- Clear-sky curve for Barcelona in June: sunrise 06:20, sunset 21:25; hourly yield = `kWp × 0.82 × sin(π × (t − sunrise)/(sunset − sunrise))^1.3` for t in daylight, else 0.
- Daily weather factor: sun 0.92–1.0, partly 0.6–0.8, cloud 0.3–0.5, rain 0.15–0.3 (seeded random within range).
- Hourly noise ±6% for "actual".
- Expected = clear-sky × weather factor (no noise, perfRatio 1).
- Actual = expected × perfRatio × noise. Offline → 0.
- Forecast uncertainty: p10 = forecast × 0.85, p90 = forecast × 1.1 (day+1), widening 3% per extra day.

### 8.3 Scenarios
- **Weather (7 days):** sun, sun, partly, rain + `stormRisk` (hail Thursday 15–18h), partly, sun, sun.
- **Household:** "Ramon", 6.0 kWp, Barcelona (Sant Martí), status ok, perfRatio 0.98. Savings assume 45% self-consumption and EUR 0.20/kWh (labelled as demo assumption).
- **Portfolio:** 250 sites scattered within the Barcelona metro area (lat 41.32–41.47, lng 2.05–2.25, avoid the sea: lng > 2.05 + (41.47 − lat) × 0 … simply reject points east of the coastline approximated by `lng > 2.0 + (lat − 41.3) × 1.2 + 0.18`). kWp 5–20 (skewed toward 5–10). Status mix: 88% ok, 9% underperforming, 3% offline.
- Expected loss per alert = (expected − actual) kWh/day × EUR 0.20.

---

## 9. Measurement: testing the three open questions

`track(event: EventName, props?: Record<string, string | number | boolean>)` appends `{ event, props, ts, sessionId }` to `localStorage['ss_events']`. `sessionId` is a random id per browser session. No cookies, no personal data unless typed into the pilot form.

| Question | Events |
|---|---|
| **Who pays?** | `demo_role_selected {role}` · `pricing_audience_toggled {audience}` · `pilot_submitted {role, rooftops}` |
| **For what?** | `pricing_plan_clicked {plan, audience}` · `feature_interest {feature}` (from "I'd pay" buttons) · `remind_toggle` · `whitelabel_toggled {on}` · `csv_exported` · `pilot_submitted {feature}` |
| **Which channel?** | `audience_tab_viewed {tab}` · `cta_clicked {location}` · `connect_started` · `connect_completed {brand}` · `connect_brand_unsupported` |

Optional: if `VITE_PLAUSIBLE_DOMAIN` is set, also send events to Plausible (script tag only then). Otherwise local only.

`/insights` groups events by these three questions and shows them as bar charts.

---

## 10. Copy and content rules
- Language: **English**, plain and short. Max ~12 words per sentence on marketing pages.
- Brand name: **"Nnergix Sentinel Solar"** on first mention, then "Sentinel Solar".
- Never mention a case study, course, exam, BCG, or the strategy proposal inside the website.
- No real third-party brands or logos (retailers, inverter manufacturers, clients). Use the fictional names given above ("Sunvolt Energy", "Inverter brand A–H").
- No invented customer testimonials or performance claims presented as real. Stats must be product facts (0 hardware, 7-day forecast) or clearly labelled demo values.
- Units: kWh, kWp, MWh; EUR written as "EUR 30" in text and "€30" allowed in pricing cards.

---

## 11. Accessibility, responsiveness and performance
- WCAG AA contrast for all text; focus rings visible (2px `--brand-500` offset 2px).
- All interactive elements reachable by keyboard; charts have an accessible summary sentence (`aria-label`).
- Breakpoints: mobile 375, tablet 768, desktop 1280. Every page must work at 375px with no horizontal scroll.
- Lighthouse targets on the landing page: Performance ≥ 90, Accessibility ≥ 95, Best practices ≥ 95, SEO ≥ 90.
- Lazy-load the map and charts below the fold. Fonts with `display=swap`.
- `prefers-reduced-motion`: disable animations.
- Meta: title "Nnergix Sentinel Solar – Rooftop solar, forecast and monitored", description, Open Graph image.

---

## 12. Build plan with acceptance criteria

**Step 0 – Brand check**
- Confirm Nnergix brand colours (section 5.2) and update tokens.
- ✅ Done when `globals.css` and `tokens.ts` hold the final values.

**Step 1 – Scaffold**
- `npm create vite@latest sentinel-solar-mvp -- --template react-ts`, add Tailwind, Router, Recharts, Leaflet, lucide-react, framer-motion, ESLint + Prettier.
- ✅ `npm run dev` shows a blank page with Inter font and brand CSS variables; `npm run build` succeeds.

**Step 2 – Design system components**
- Build `ui/` components (Button, Card, Badge, Tabs, Toggle, Stat, Eyebrow, Modal, Table, EmptyState, Tooltip) + Navbar/Footer.
- ✅ A temporary `/styleguide` route shows every component in all states; no lint errors.

**Step 3 – Demo data**
- Implement `random.ts`, `solar.ts`, `weather.ts`, `household.ts`, `portfolio.ts` per section 8.
- ✅ Unit check (simple `console.assert` or Vitest): 250 sites, status mix within ±2%, all coordinates on land, daily household kWh on a sunny day between 30 and 42.

**Step 4 – Landing page**
- All 11 sections from 7.2 with real component previews.
- ✅ Looks clean at 375/768/1280px; every CTA routes correctly; tab clicks tracked.

**Step 5 – Demo hub + Connect flow**
- ✅ Wizard works end-to-end; "Other" brand path captured; lands on `/app/home`.

**Step 6 – Homeowner app**
- All 8 cards from 7.6.
- ✅ Charts render with demo data; health badge correct; "I'd pay" tracked and shows toast.

**Step 7 – Portfolio, site detail, maintenance**
- ✅ Map shows 250 coloured dots; popover → site detail; "Create task" adds a card to Maintenance and persists after reload; CSV export downloads a valid file; white-label modal works.

**Step 8 – Pricing + Request a pilot**
- ✅ Audience toggle switches tiers; plan modal routes to `/pilot` with plan prefilled; form validates and shows success.

**Step 9 – Measurement + Insights**
- ✅ Every event in section 9 fires; `/insights` shows grouped counts; CSV export and reset work.

**Step 10 – Polish**
- Motion, empty states, 404, favicon, OG image, meta tags, demo banner.
- ✅ Lighthouse targets met; no console errors; keyboard navigation works.

**Step 11 – Deploy** (section 13)
- ✅ Public Vercel URL works, deep links (e.g. `/app/portfolio`) load directly without 404.

---

## 13. GitHub + Vercel deployment

1. Create a new GitHub repository, e.g. `sentinel-solar-mvp` (public or private).
2. Locally:
   ```bash
   git init
   git add .
   git commit -m "Sentinel Solar MVP"
   git branch -M main
   git remote add origin https://github.com/<your-user>/sentinel-solar-mvp.git
   git push -u origin main
   ```
3. Add `vercel.json` in the repo root so client-side routes work:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
   ```
4. On vercel.com → **Add New → Project → Import** the GitHub repo.
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables (optional): `VITE_FORM_ENDPOINT`, `VITE_PLAUSIBLE_DOMAIN`
5. Deploy. Every push to `main` redeploys automatically.
6. Optional: set a clean project name in Vercel (e.g. `sentinel-solar.vercel.app`) or connect a custom domain.
7. Put the final URL (and a QR code) on the MVP slide of the proposal.

---

## 14. Out of scope
- Real inverter API connections, real weather data, real ML models.
- User accounts, authentication, payments.
- Backend, database, emails (pilot form stays local unless `VITE_FORM_ENDPOINT` is set).
- Multi-language support (English only).
- Aggregator and grid-operator features beyond "coming soon" teasers.

---

## 15. Disclaimer text
Show in the footer and on `/insights`:

> *"Sentinel Solar prototype. All systems, people, addresses and figures shown are simulated demo data. No real inverters are connected and nothing is charged."*
