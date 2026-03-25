# WildLawn Lawncare — Dark Luxury Marketing Template

A high-converting, single-page marketing website for lawn care and landscaping businesses. Built with a dark luxury aesthetic, vanilla web technologies, and Netlify's serverless platform for zero-maintenance hosting and lead management.

**Live Site**: [wildlawnlawncare.com](https://wildlawnlawncare.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3 (custom properties), Vanilla JavaScript |
| Fonts | Google Fonts (Playfair Display + DM Sans) |
| Backend | Netlify Functions (Node.js serverless) |
| Database | Netlify Blobs (key-value store) |
| Hosting | Netlify (CDN, auto SSL, CI/CD from GitHub) |
| Image Scraping | Playwright (dev dependency for stock photo downloads) |

No frameworks, no build step, no database server. The site deploys as static files with serverless API endpoints.

---

## Features

### Marketing Site (`index.html`)
- Full-viewport hero with video background and animated stats
- Pain points section addressing common customer frustrations
- Services grid with images and descriptions
- "Why Choose Us" section with team photo and feature list
- Horizontal-scrolling testimonials carousel
- 4-step "How It Works" process timeline
- Photo gallery of completed work
- SEO-optimized service area pages with city-specific content
- 3-tier pricing packages
- FAQ accordion
- Contact form with honeypot spam protection
- Floating phone/AI receptionist button
- Runtime color picker (accent color switcher)
- Scroll animations (fade-up on intersection)
- Mobile-responsive with hamburger menu
- Schema.org LocalBusiness structured data
- Open Graph and Twitter Card meta tags

### Blog (`blog.html`)
- SEO-optimized long-form articles targeting local keywords
- BlogPosting Schema.org structured data per article
- Sticky navigation and consistent footer
- Internal CTAs linking to contact form

### Admin Dashboard (`admin.html`)
- Password-protected login (with magic link option)
- Lead management table with search, filter, and status tracking
- Lead detail modal with notes, quick actions (call/email), and status changes
- CSV export of all leads
- Fleet management (trucks with Google Calendar integration)
- Services and pricing configuration
- AI receptionist settings (ElevenLabs integration toggle)
- Mobile-responsive card layout for leads

### Serverless API (`netlify/functions/`)
- `submit-lead.js` — Receives form submissions, stores in Netlify Blobs
- `get-leads.js` — Retrieves leads (authenticated)
- `update-lead.js` — Updates lead status and notes (authenticated)
- `delete-lead.js` — Removes a lead (authenticated)
- `send-notification.js` — Stores lead notification records
- `get-settings.js` — Returns fleet/services config (public + authenticated modes)
- `update-settings.js` — Saves fleet/services config (authenticated)

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- A [Netlify](https://netlify.com) account
- A [GitHub](https://github.com) account

### Local Development

```bash
# Clone the repository
git clone https://github.com/bensblueprints/wildlawn-lawncare.git
cd wildlawn-lawncare

# Install dependencies
npm install

# Start local dev server with Netlify Functions
netlify dev
```

The site will be available at `http://localhost:8888`.

### Download Stock Images (Optional)

The project includes a Playwright script to download royalty-free stock images:

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run the image downloader
node scripts/download-images.js
```

This populates the `images/` directory with stock photos for services, hero, gallery, etc.

---

## Environment Variables

Set these in your Netlify dashboard under **Site settings > Environment variables**, or via the Netlify CLI:

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Password for admin dashboard login |
| `NOTIFICATION_EMAIL` | Yes | Email address to receive lead notifications |
| `BUSINESS_NAME` | Yes | Business name (used in notification emails) |
| `SITE_URL` | Yes | Production URL (e.g., `https://wildlawnlawncare.com`) |

```bash
# Set via CLI
netlify env:set ADMIN_PASSWORD "your-secure-password"
netlify env:set NOTIFICATION_EMAIL "you@example.com"
netlify env:set BUSINESS_NAME "WildLawn Lawncare LLC"
netlify env:set SITE_URL "https://wildlawnlawncare.com"
```

---

## Admin Panel Guide

### Accessing the Dashboard

Navigate to `/admin` on your site (e.g., `https://wildlawnlawncare.com/admin`). Log in with the password set in the `ADMIN_PASSWORD` environment variable.

### Managing Leads

- **View leads**: All form submissions appear in the leads table, sorted by date
- **Filter**: Use the status dropdown and search box to find specific leads
- **Update status**: Click a lead to open the detail modal, then change status (New, Contacted, Booked, Closed)
- **Add notes**: Write internal notes on any lead from the detail modal
- **Export**: Click "Export CSV" to download all leads as a spreadsheet
- **Delete**: Remove leads from the detail modal

### Fleet Management

- Add trucks with names and optional Google Calendar IDs
- Set truck status (Active/Inactive)
- Save fleet configuration for use by the AI booking agent

### Services & Pricing

- Add services with name, description, price display, and duration
- Set service status (Active/Inactive)
- Active services are available to the AI booking agent and public settings API

### AI Receptionist

- Toggle the ElevenLabs Conversational AI integration on/off
- Enter your ElevenLabs Agent ID
- Customize the greeting message
- When enabled, a "Talk to AI Receptionist" button appears on the main site

---

## Deployment Guide

### Deploy to Netlify (from GitHub)

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
gh repo create bensblueprints/wildlawn-lawncare --private --source=. --push

# Link to Netlify
netlify init
# Select "Create & configure a new site"
# Choose your team
# Set site name (optional)

# Deploy
netlify deploy --prod
```

### Connect Custom Domain

1. In Netlify dashboard: **Site settings > Domain management > Add custom domain**
2. Add your domain (e.g., `wildlawnlawncare.com`)
3. Update DNS at your registrar:
   - **A record**: `75.2.60.5`
   - **CNAME** (www): `your-site.netlify.app`
4. Netlify automatically provisions an SSL certificate via Let's Encrypt

### Continuous Deployment

Once linked to GitHub, every push to the `main` branch triggers an automatic deploy on Netlify. No manual intervention needed.

---

## Project Structure

```
wildlawn-lawncare/
├── index.html                    # Main marketing landing page
├── blog.html                     # SEO blog with long-form articles
├── admin.html                    # Admin dashboard (password-protected)
├── css/
│   ├── style.css                 # Main stylesheet (design system + components)
│   └── admin.css                 # Admin dashboard styles
├── js/
│   ├── main.js                   # Main site JavaScript (color picker, AI widget, animations)
│   └── admin.js                  # Admin dashboard JavaScript (leads, fleet, settings)
├── images/
│   ├── logo.jpg                  # Business logo
│   ├── hero-bg.jpg               # Hero background image
│   ├── hero-lawn.jpg             # Hero side image
│   ├── hero-lawn-wide.jpg        # Wide hero variant
│   ├── hero-video.mp4            # Hero background video
│   ├── about-team.jpg            # Team/about photo
│   ├── service-*.jpg             # Service-specific images (7 files)
│   └── gallery-*.jpg             # Portfolio gallery images (6 files)
├── netlify/
│   └── functions/
│       ├── submit-lead.js        # POST: receive form submissions
│       ├── get-leads.js          # GET: retrieve leads (auth)
│       ├── update-lead.js        # POST: update lead status/notes (auth)
│       ├── delete-lead.js        # POST: delete a lead (auth)
│       ├── send-notification.js  # POST: store notifications
│       ├── get-settings.js       # GET: fleet/services config
│       └── update-settings.js    # POST: save fleet/services config (auth)
├── scripts/
│   └── download-images.js        # Playwright script to download stock images
├── netlify.toml                  # Netlify build config, headers, redirects
├── package.json                  # Dependencies (@netlify/blobs, playwright)
├── .gitignore                    # Excludes node_modules/ and .netlify/
├── TEMPLATE.md                   # Template build guide for spinning up new client sites
└── README.md                     # This file
```

---

## Template Usage

This project is designed as a **reusable template** for spinning up lawn care and landscaping client websites. See **[TEMPLATE.md](TEMPLATE.md)** for the complete guide, which includes:

- JSON schema for client data input
- File-by-file customization instructions
- Deployment checklist
- AI agent prompt for automated site generation
- Design system reference (colors, fonts, spacing, components)

### Quick Start for a New Client

1. Copy this project to `~/websites/{client-slug}/`
2. Fill out the client data JSON (defined in TEMPLATE.md)
3. Find-and-replace business name, phone, email, URL, and accent colors
4. Replace images with client photos
5. Customize service areas, testimonials, FAQ, and blog content
6. Deploy to Netlify with client-specific environment variables

---

## License

All rights reserved. This template and its contents are proprietary. Unauthorized reproduction, distribution, or use is prohibited without explicit written permission.
