# Advanced Marketing Dark Luxury Template — Build Guide

> **Purpose**: This document is a master prompt and project plan for an AI agent (or human developer) to spin up a new lawn care / landscaping client website from the WildLawn Lawncare template. It covers the data input format, file-by-file customization instructions, deployment checklist, AI agent prompt, and design system reference.

---

## Table of Contents

1. [Data Input Format (Client JSON Schema)](#1-data-input-format)
2. [File-by-File Customization Guide](#2-file-by-file-customization-guide)
3. [Deployment Checklist](#3-deployment-checklist)
4. [AI Agent Instructions](#4-ai-agent-instructions)
5. [Design System Reference](#5-design-system-reference)

---

## 1. Data Input Format

Before building a client site, gather all client data into the following JSON structure. Every field marked with a comment is required; optional fields are noted.

```json
{
  "business": {
    "name": "GreenEdge Lawn Care LLC",
    "displayName": "Green Edge",
    "slug": "greenedge-lawncare",
    "phone": "(678) 555-1234",
    "phoneRaw": "6785551234",
    "email": "info@greenedgelawncare.com",
    "url": "https://greenedgelawncare.com",
    "tagline": "Quality Lawn Care for Every Budget",
    "description": "GreenEdge Lawn Care LLC provides professional lawn care and landscaping services in Metro Atlanta.",
    "hours": {
      "weekday": "8am - 6pm",
      "weekend": "By Appointment"
    },
    "serviceArea": ["Marietta", "Kennesaw", "Roswell", "Alpharetta", "Woodstock", "Acworth", "Canton", "Smyrna", "Vinings"],
    "state": "GA",
    "stateFullName": "Georgia",
    "metro": "Metro Atlanta",
    "city": "Atlanta",
    "geo": {
      "latitude": "33.7490",
      "longitude": "-84.3880"
    },
    "trustBadges": ["Licensed", "Insured", "Reliable"],
    "rating": "4.9",
    "reviewCount": "500",
    "socialLinks": {
      "facebook": "",
      "instagram": "",
      "google": "",
      "yelp": ""
    }
  },
  "branding": {
    "accentColor": "#48BB78",
    "accentLight": "#68D391",
    "accentDark": "#38A169",
    "logoPath": "images/logo.jpg"
  },
  "services": [
    {
      "name": "Lawn Maintenance",
      "shortDesc": "Weekly and bi-weekly mowing, edging, trimming, and blowing to keep your lawn looking its best year-round.",
      "longDesc": "Our comprehensive lawn maintenance service includes precision mowing at the optimal height for your grass type, clean edging along driveways and walkways, string trimming around obstacles, and thorough debris blowing. We adjust our schedule and techniques based on seasonal growth patterns to keep your lawn healthy and beautiful.",
      "image": "images/service-mowing.jpg",
      "icon": "mowing"
    },
    {
      "name": "Mulching & Bed Maintenance",
      "shortDesc": "Fresh mulch installation, bed edging, and weed control to enhance your landscape beds.",
      "longDesc": "",
      "image": "images/service-mulching.jpg",
      "icon": "mulching"
    },
    {
      "name": "Bush & Shrub Trimming",
      "shortDesc": "Expert shaping, pruning, and hedge trimming to maintain clean, manicured shrubs.",
      "longDesc": "",
      "image": "images/service-shrub.jpg",
      "icon": "shrub"
    },
    {
      "name": "Seasonal Cleanups",
      "shortDesc": "Spring and fall cleanup services including leaf removal, bed prep, and debris hauling.",
      "longDesc": "",
      "image": "images/service-cleanup.jpg",
      "icon": "cleanup"
    },
    {
      "name": "Fertilization & Weed Control",
      "shortDesc": "Custom fertilization programs and targeted weed treatments for a thick, green lawn.",
      "longDesc": "",
      "image": "images/service-fertilization.jpg",
      "icon": "fertilization"
    },
    {
      "name": "Landscape Design & Installation",
      "shortDesc": "Custom landscape design and installation including plants, hardscaping, and outdoor features.",
      "longDesc": "",
      "image": "images/service-landscape-design.jpg",
      "icon": "landscape"
    },
    {
      "name": "Pressure Washing",
      "shortDesc": "Professional pressure washing for driveways, patios, decks, siding, and walkways.",
      "longDesc": "",
      "image": "images/service-pressure-washing.jpg",
      "icon": "pressure-washing"
    }
  ],
  "packages": [
    {
      "name": "Basic",
      "description": "Perfect for homeowners who want reliable weekly lawn maintenance without the extras.",
      "features": [
        "Weekly Mowing",
        "String Trimming",
        "Edging (Driveways & Walkways)",
        "Blowing (All Hard Surfaces)"
      ],
      "featured": false
    },
    {
      "name": "Standard",
      "description": "Our most popular plan — everything in Basic plus bed maintenance and seasonal weed control.",
      "features": [
        "Everything in Basic",
        "Bi-Weekly Bed Maintenance",
        "Weed Control (Beds & Lawn)",
        "Monthly Edging Detail",
        "Priority Scheduling"
      ],
      "featured": true
    },
    {
      "name": "Premium",
      "description": "The full-service experience for homeowners who want a flawless property year-round.",
      "features": [
        "Everything in Standard",
        "Quarterly Shrub Trimming",
        "Seasonal Fertilization (4x/year)",
        "Annual Mulch Refresh",
        "Priority Scheduling & Support"
      ],
      "featured": false
    }
  ],
  "testimonials": [
    {
      "name": "Sarah M.",
      "location": "Marietta, GA",
      "quote": "Wild Lawn completely transformed our front yard. They show up on time every week, the crew is professional, and our lawn has never looked better. Highly recommend to anyone in the Marietta area!",
      "initials": "SM",
      "rating": 5
    },
    {
      "name": "James R.",
      "location": "Kennesaw, GA",
      "quote": "We switched to Wild Lawn after our old service kept canceling on us. Night and day difference — reliable, affordable, and the quality of work is outstanding. Our neighbors keep asking who does our lawn.",
      "initials": "JR",
      "rating": 5
    },
    {
      "name": "Linda T.",
      "location": "Roswell, GA",
      "quote": "From the first phone call to the finished work, Wild Lawn has been exceptional. They mulched all our beds, trimmed the bushes, and now maintain our lawn weekly. Best lawn care company in Metro Atlanta, hands down.",
      "initials": "LT",
      "rating": 5
    }
  ],
  "painPoints": [
    {
      "title": "Unreliable Providers",
      "description": "Sick of lawn companies that cancel, no-show, or ghost you mid-season?",
      "icon": "unreliable"
    },
    {
      "title": "Overpriced Services",
      "description": "Tired of paying premium prices for mediocre, inconsistent results?",
      "icon": "overpriced"
    },
    {
      "title": "Poor Communication",
      "description": "Frustrated with services that never return calls or send updates?",
      "icon": "communication"
    },
    {
      "title": "Cookie-Cutter Treatments",
      "description": "Every lawn is different, but most companies treat them all the same.",
      "icon": "cookie-cutter"
    }
  ],
  "faq": [
    {
      "question": "What areas do you serve?",
      "answer": "We proudly serve homeowners across Metro Atlanta including Marietta, Kennesaw, Roswell, Alpharetta, Woodstock, Acworth, Canton, Smyrna, and Vinings. If you are unsure whether your area is covered, give us a call and we will let you know!"
    },
    {
      "question": "How much does lawn care cost?",
      "answer": "Pricing depends on your property size, the services you need, and frequency of service. We offer free estimates and transparent pricing with no hidden fees. Contact us to get a custom quote for your property."
    },
    {
      "question": "Do I need to be home for service?",
      "answer": "No! As long as we have access to your lawn, we can complete our work whether you are home or not. We will notify you when we arrive and send a summary when the job is complete."
    },
    {
      "question": "Are you licensed and insured?",
      "answer": "Yes, we are fully licensed and insured. We carry general liability insurance and workers compensation coverage to protect both our team and your property."
    },
    {
      "question": "How do I get started?",
      "answer": "Getting started is easy! Fill out our contact form or call us directly. We will schedule a free consultation, walk your property, and provide a detailed quote within 24 hours. Once you approve, we can usually begin service within the same week."
    }
  ],
  "serviceAreas": [
    {
      "city": "Marietta",
      "description": "Professional lawn care and landscaping services in Marietta, GA. From historic downtown Marietta to East Cobb, we keep residential lawns pristine with weekly mowing, mulching, shrub trimming, and seasonal cleanups. Our Marietta clients love our reliability and attention to detail."
    },
    {
      "city": "Kennesaw",
      "description": "Serving Kennesaw homeowners with premium lawn maintenance, fertilization, and landscape design. Whether you live near Kennesaw Mountain or in one of the many established neighborhoods, our team delivers consistent, high-quality results every visit."
    },
    {
      "city": "Roswell",
      "description": "Roswell's premier lawn care provider offering full-service maintenance, mulching, pressure washing, and landscape installations. We understand the unique needs of Roswell properties and tailor our services to match the area's beautiful, established landscapes."
    }
  ],
  "blog": [
    {
      "title": "Best Lawn Care Tips for Atlanta Homeowners",
      "slug": "article-1",
      "keywords": ["lawn care tips Atlanta", "lawn maintenance Georgia"],
      "description": "Comprehensive lawn care tips for Atlanta homeowners covering mowing, watering, fertilization, weed prevention, and seasonal checklists for Georgia lawns.",
      "sections": [
        {
          "heading": "Understanding Atlanta's Climate and Your Lawn",
          "body": "Atlanta's humid subtropical climate creates unique challenges and opportunities for lawn care..."
        }
      ]
    }
  ],
  "images": {
    "hero": "images/hero-bg.jpg",
    "heroLawn": "images/hero-lawn.jpg",
    "heroWide": "images/hero-lawn-wide.jpg",
    "heroVideo": "images/hero-video.mp4",
    "logo": "images/logo.jpg",
    "about": "images/about-team.jpg",
    "gallery": [
      "images/gallery-1.jpg",
      "images/gallery-2.jpg",
      "images/gallery-3.jpg",
      "images/gallery-4.jpg",
      "images/gallery-5.jpg",
      "images/gallery-6.jpg"
    ]
  }
}
```

### Field Reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `business.name` | string | Yes | Legal business name (used in copyright, Schema.org) |
| `business.displayName` | string | Yes | Short name for nav, headings (e.g., "Wild Lawn") |
| `business.slug` | string | Yes | URL-safe folder name (e.g., "greenedge-lawncare") |
| `business.phone` | string | Yes | Formatted phone number for display |
| `business.phoneRaw` | string | Yes | Digits only, used in `tel:` links |
| `business.email` | string | Yes | Contact email |
| `business.url` | string | Yes | Production URL with https:// |
| `business.tagline` | string | Yes | Main tagline shown in hero and meta descriptions |
| `business.description` | string | Yes | 1-2 sentence description for meta and Schema.org |
| `business.hours` | object | Yes | `weekday` and `weekend` strings |
| `business.serviceArea` | array | Yes | List of city names served |
| `business.state` | string | Yes | 2-letter state abbreviation |
| `business.stateFullName` | string | Yes | Full state name (for blog content) |
| `business.metro` | string | Yes | Metro area name (e.g., "Metro Atlanta") |
| `business.city` | string | Yes | Primary city for address/Schema.org |
| `business.geo` | object | Yes | Latitude and longitude for Schema.org |
| `business.trustBadges` | array | Yes | Badges shown in hero and footer (e.g., "Licensed") |
| `business.rating` | string | No | Aggregate rating for Schema.org |
| `business.reviewCount` | string | No | Review count for Schema.org |
| `branding.accentColor` | string | Yes | Primary accent hex color |
| `branding.accentLight` | string | Yes | Light variant of accent |
| `branding.accentDark` | string | Yes | Dark variant of accent |
| `branding.logoPath` | string | Yes | Path to logo image |
| `services` | array | Yes | Minimum 3 services |
| `packages` | array | Yes | Pricing tiers, one should have `featured: true` |
| `testimonials` | array | Yes | Minimum 3 testimonials |
| `faq` | array | Yes | Minimum 5 Q&A pairs |
| `serviceAreas` | array | Yes | One entry per major city served, ~150 words each |
| `blog` | array | Yes | Minimum 3 blog articles |
| `images` | object | Yes | All image paths (see images section below) |

---

## 2. File-by-File Customization Guide

### 2.1 `index.html` — Main Landing Page

This is the largest file and requires the most changes. Every section is listed below.

#### `<head>` Section (Lines 1-95)

| What to Change | Location | Example |
|----------------|----------|---------|
| `<title>` tag | Line 6 | `{business.displayName} \| {business.tagline} \| {business.metro}, {business.state}` |
| `<meta name="description">` | Line 7 | Use `business.description` + phone number |
| `<meta name="keywords">` | Line 8 | Generate from services + cities (e.g., "lawn care {city}") |
| `<meta name="author">` | Line 9 | `{business.name}` |
| `<link rel="canonical">` | Line 11 | `{business.url}/` |
| Open Graph `og:title` | Line 14 | `{business.name} \| {business.tagline}` |
| Open Graph `og:description` | Line 15 | Business description + phone |
| Open Graph `og:url` | Line 17 | `{business.url}/` |
| Open Graph `og:site_name` | Line 20 | `{business.name}` |
| Twitter Card meta tags | Lines 23-26 | Mirror OG tags |
| Schema.org JSON-LD | Lines 39-95 | Replace all fields: name, description, url, telephone, email, logo, address, geo, areaServed, openingHours, aggregateRating |

#### Inline `<style>` Block (Lines 97-500+)

| What to Change | Location |
|----------------|----------|
| `:root` accent variables | Line 113-116 | Replace `#48BB78`, `#68D391`, `#38A169` with `branding.accentColor`, `branding.accentLight`, `branding.accentDark` |
| Any hardcoded accent hex values (e.g., `rgba(72,187,120,...`) | Throughout inline CSS | Convert new accent color to RGB and replace |

#### Navigation (around Line 1155)

| What to Change | Notes |
|----------------|-------|
| Logo `<img>` src and alt | Replace with `branding.logoPath` and `business.name` |
| Logo text `<span>` | Replace "Wild **Lawn**" with `business.displayName` (accent span on second word) |
| Nav CTA phone link | Replace `tel:7704902542` and display text with `business.phoneRaw` and `business.phone` |
| Mobile menu: same changes | Logo, phone link, and CTA |

#### Hero Section (`#hero`, around Line 1207)

| What to Change | Notes |
|----------------|-------|
| `<video>` or `<img>` source | Replace with `images.heroVideo` or `images.hero` |
| Trust badges text | Replace "Licensed \| Insured \| Reliable" with `business.trustBadges.join(" \| ")` |
| `<h1>` heading | Rewrite with `business.displayName` and `business.tagline` |
| `<p>` subtext | Rewrite with business description mentioning `business.metro` |
| CTA button phone link | `tel:{business.phoneRaw}` and `Call {business.phone}` |
| Hero stats (500+, 4.9 stars, etc.) | Update with client-specific numbers |
| Hero image `<img>` | Replace with `images.heroLawn` |

#### Pain Points Section (`#pain-points`, around Line 1251)

| What to Change | Notes |
|----------------|-------|
| Section subtitle | Mention `business.metro` |
| Each pain card title + description | Replace with `painPoints[]` data |

#### Services Section (`#services`, around Line 1292)

| What to Change | Notes |
|----------------|-------|
| Section title and subtitle | Mention `business.metro` and business name |
| Each `.service-card` | One card per `services[]` entry: image, name, shortDesc |
| "Learn More" links | Point to `#contact` |
| Contact form service `<select>` options | Must match `services[].name` values |

#### Why Us Section (`#why-us`, around Line 1410)

| What to Change | Notes |
|----------------|-------|
| Section title | Mention city/metro area and business name |
| Each feature bullet | Customize with business-specific differentiators |
| About team image | Replace with `images.about` |

#### Testimonials Section (`#testimonials`, around Line 1495)

| What to Change | Notes |
|----------------|-------|
| Section subtitle | Mention `business.metro` and business name |
| Each testimonial card | Replace name, location, quote, initials from `testimonials[]` |
| Star ratings | Update per testimonial |

#### Process Section (`#process`, around Line 1616)

| What to Change | Notes |
|----------------|-------|
| Section subtitle | Mention business name |
| Step descriptions | Customize contact methods (phone, etc.) |

#### Gallery Section (`#gallery`, around Line 1649)

| What to Change | Notes |
|----------------|-------|
| Section subtitle | Mention `business.metro` and cities |
| Gallery images | Replace with `images.gallery[]` |
| Image alt text | Descriptive alt for each image |

#### Service Areas Section (`#service-areas`, around Line 1704)

| What to Change | Notes |
|----------------|-------|
| Section title and subtitle | Mention `business.metro` |
| Each area card | One per `serviceAreas[]` entry: city name and 150-word description |
| City-specific keywords | Embed naturally for SEO |

#### Pricing Section (`#pricing`, around Line 1755)

| What to Change | Notes |
|----------------|-------|
| Section subtitle | Mention business name |
| Each pricing card | One per `packages[]` entry: name, description, features, featured flag |
| CTA buttons | Phone links with `business.phone` |

#### FAQ Section (`#faq`, around Line 1810)

| What to Change | Notes |
|----------------|-------|
| Section subtitle | Mention `business.metro`, business name, phone |
| Each FAQ item | One per `faq[]` entry: question and answer |
| Answer content | Should mention business name and service areas where relevant |

#### Contact Section (`#contact`, around Line 1931)

| What to Change | Notes |
|----------------|-------|
| Section subtitle | Mention business name and phone |
| Contact info sidebar | Phone, email, hours from `business` object |
| Service `<select>` options | Match `services[].name` |
| Form success message phone fallback | Replace `(770) 490-2542` |

#### Footer (around Line 2052)

| What to Change | Notes |
|----------------|-------|
| Logo image and text | `branding.logoPath` and `business.displayName` |
| Brand description paragraph | Rewrite with business name, services, and cities |
| Services list | Match `services[].name` |
| Contact info | Phone, email, hours, metro area |
| Copyright line | `business.name` |
| Trust badges | `business.trustBadges` |
| Social links | If provided |

#### Floating CTA & Inline Scripts (around Line 2106-2244)

| What to Change | Notes |
|----------------|-------|
| Floating call button `href` | `tel:{business.phoneRaw}` |
| Floating call button text | `Call {business.phone}` |
| AI Receptionist greeting | Mention business name |
| Form submission error alert | Replace fallback phone number |

### 2.2 `blog.html` — Blog Page

| What to Change | Notes |
|----------------|-------|
| `<title>` tag | `Lawn Care Blog \| {business.name} \| {business.metro}, {business.state}` |
| `<meta name="description">` | Mention metro area and business name |
| `<meta name="author">` | `business.name` |
| `<link rel="canonical">` | `{business.url}/blog.html` |
| Open Graph tags | Update all OG and Twitter meta tags |
| BlogPosting Schema.org JSON-LD | One block per blog article: headline, description, author, publisher (with logo URL), dates, keywords |
| Navigation | Same changes as index.html nav |
| Each blog article | Replace title, content sections, keyword mentions, city references |
| Blog article internal links | Link back to `#contact` on index.html with correct phone |
| CTA sections within articles | Business name, phone, service area mentions |
| Footer | Same changes as index.html footer |

### 2.3 `admin.html` — Admin Dashboard

| What to Change | Notes |
|----------------|-------|
| `<title>` tag (Line 6) | `{business.displayName} -- Admin Dashboard` |
| Login card logo `<img>` (Line 18) | `branding.logoPath` and alt text |
| Login title `<h1>` (Line 20) | `{business.name}` |
| Topbar brand `<h2>` (Line 87) | `{business.name}` |
| AI Receptionist greeting placeholder (Line 248) | Mention business name |
| Accent color references in inline styles | Replace `#48BB78` with `branding.accentColor` |

### 2.4 `css/style.css` — Main Stylesheet

| What to Change | Notes |
|----------------|-------|
| `:root` custom properties (Lines 16-18) | `--accent`, `--accent-light`, `--accent-dark` |
| Any hardcoded `rgba(72,187,120,...)` values | Convert new accent to RGB equivalents |
| Comment header (Line 3) | Replace "WildLawn Lawncare LLC" with business name |

### 2.5 `css/admin.css` — Admin Stylesheet

| What to Change | Notes |
|----------------|-------|
| Any accent color references | Replace `#48BB78` and variants with branding colors |

### 2.6 `js/main.js` — Main JavaScript

| What to Change | Notes |
|----------------|-------|
| Any hardcoded business name strings | Replace with client name |
| Any hardcoded phone numbers | Replace with client phone |
| Color picker default values | Update accent color hex values |
| ElevenLabs AI agent greeting | Mention business name |

### 2.7 `js/admin.js` — Admin JavaScript

| What to Change | Notes |
|----------------|-------|
| Generally no changes needed | Business name is pulled from HTML |
| Any hardcoded references to "WildLawn" | Replace with client name |

### 2.8 `netlify/functions/*.js` — Serverless Functions

These files are **generic** and typically require **no changes**. They use Netlify Blobs for storage and environment variables for configuration. The functions are:

| Function | Purpose |
|----------|---------|
| `submit-lead.js` | Receives contact form submissions, stores in Netlify Blobs |
| `get-leads.js` | Retrieves leads for admin dashboard (auth required) |
| `update-lead.js` | Updates lead status/notes (auth required) |
| `delete-lead.js` | Deletes a lead (auth required) |
| `send-notification.js` | Stores lead notifications |
| `get-settings.js` | Returns fleet/services settings (public + auth modes) |
| `update-settings.js` | Saves fleet/services settings (auth required) |

### 2.9 `netlify.toml` — Netlify Configuration

| What to Change | Notes |
|----------------|-------|
| Generally no changes needed | Redirects and headers are generic |
| Add custom redirects if needed | e.g., `/old-url` to `/new-url` |

### 2.10 `package.json`

| What to Change | Notes |
|----------------|-------|
| `name` field | `{business.slug}-website` |
| `description` field | `{business.name} - Professional lawn care and landscaping website` |

### 2.11 `scripts/download-images.js` — Image Downloader

| What to Change | Notes |
|----------------|-------|
| `IMAGE_JOBS` array | Update search queries to match client services |
| Add/remove entries | Match the services and gallery images needed |

### 2.12 Image Files to Replace

All images in the `images/` directory must be replaced with client-specific images:

| File | Purpose | Recommended Size |
|------|---------|-----------------|
| `logo.jpg` | Business logo | 200x200px, square |
| `hero-bg.jpg` | Hero background image | 1920x1080px |
| `hero-lawn.jpg` | Hero side image | 800x600px |
| `hero-lawn-wide.jpg` | Wide hero variant | 1920x800px |
| `hero-video.mp4` | Hero background video | 1920x1080, <10MB, 15-30s loop |
| `about-team.jpg` | About/team photo | 800x600px |
| `service-mowing.jpg` | Lawn mowing service | 600x400px |
| `service-mulching.jpg` | Mulching service | 600x400px |
| `service-shrub.jpg` | Shrub trimming service | 600x400px |
| `service-cleanup.jpg` | Seasonal cleanup service | 600x400px |
| `service-fertilization.jpg` | Fertilization service | 600x400px |
| `service-landscape-design.jpg` | Landscape design service | 600x400px |
| `service-pressure-washing.jpg` | Pressure washing service | 600x400px |
| `gallery-1.jpg` through `gallery-6.jpg` | Portfolio gallery | 800x600px |

**Image sources**: Use client-provided photos first. Fill gaps with royalty-free stock from Unsplash or Pexels. The `scripts/download-images.js` Playwright script can automate stock image downloads.

---

## 3. Deployment Checklist

### Phase 1: Project Setup

- [ ] Create project folder: `~/websites/{business.slug}/`
- [ ] Copy all template files from `~/websites/wildlawn-lawncare/` (exclude `node_modules/`, `.netlify/`, `.git/`)
- [ ] Run `npm install` in the new project folder

### Phase 2: Client Data & Customization

- [ ] Populate the client JSON data object with all required fields
- [ ] **index.html**: Replace all business info (name, phone, email, tagline, meta tags, Schema.org)
- [ ] **index.html**: Replace all accent color values in inline styles and CSS variables
- [ ] **index.html**: Replace services section with client services
- [ ] **index.html**: Replace testimonials with client testimonials
- [ ] **index.html**: Replace FAQ content
- [ ] **index.html**: Replace service areas with client cities and descriptions
- [ ] **index.html**: Replace pricing packages
- [ ] **index.html**: Update navigation, footer, floating CTA, and all phone/email links
- [ ] **blog.html**: Replace all business info, meta tags, Schema.org blocks
- [ ] **blog.html**: Write/replace blog articles with client-specific, locally-optimized content
- [ ] **admin.html**: Replace business name, logo, accent colors
- [ ] **css/style.css**: Update `:root` accent color variables
- [ ] **css/admin.css**: Update accent color references
- [ ] **js/main.js**: Replace any hardcoded business name or phone references
- [ ] **package.json**: Update `name` and `description`

### Phase 3: Images

- [ ] Collect client-provided images (logo, team photo, job site photos)
- [ ] Download stock photos for any missing service/gallery images
- [ ] Optimize all images (compress to <200KB each for JPGs, use WebP where possible)
- [ ] Replace all files in `images/` directory
- [ ] Verify all `<img>` alt text is descriptive and includes relevant keywords

### Phase 4: Testing (Local)

- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Run `netlify dev` to test locally
- [ ] Verify all pages render correctly
- [ ] Test contact form submission
- [ ] Test admin panel login and lead management
- [ ] Test mobile responsiveness
- [ ] Run Lighthouse audit (target 90+ on all metrics)
- [ ] Verify all links work (no broken anchors)
- [ ] Check Schema.org with Google's Structured Data Testing Tool

### Phase 5: Git & GitHub

- [ ] `git init`
- [ ] Create `.gitignore` (ensure `node_modules/` and `.netlify/` are listed)
- [ ] `git add .` and `git commit -m "Initial commit: {business.name} website"`
- [ ] Create GitHub repo: `gh repo create bensblueprints/{business.slug} --private --source=. --push`

### Phase 6: Netlify Deployment

- [ ] Log in to Netlify: `netlify login`
- [ ] Create new site: `netlify init` (link to GitHub repo)
- [ ] Set environment variables in Netlify dashboard or CLI:
  ```
  ADMIN_PASSWORD=<strong-random-password>
  NOTIFICATION_EMAIL=<client-email>
  BUSINESS_NAME=<business-name>
  SITE_URL=<https://domain.com>
  ```
- [ ] Trigger deploy: `netlify deploy --prod`
- [ ] Verify live site loads correctly

### Phase 7: Custom Domain

- [ ] Add custom domain in Netlify dashboard (Site settings > Domain management)
- [ ] Update DNS records at domain registrar:
  - A record: `75.2.60.5` (Netlify load balancer)
  - CNAME for `www`: `{netlify-subdomain}.netlify.app`
- [ ] Enable HTTPS (automatic via Netlify Let's Encrypt)
- [ ] Verify SSL certificate is active
- [ ] Test both `www` and non-`www` redirects

### Phase 8: Post-Launch Verification

- [ ] Test contact form on production (submit a test lead)
- [ ] Log into admin panel on production
- [ ] Verify lead appears in admin dashboard
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Submit sitemap to Google Search Console
- [ ] Verify Schema.org renders in Google Rich Results Test
- [ ] Set up uptime monitoring (optional)

---

## 4. AI Agent Instructions

Copy and paste the following prompt block to instruct an AI agent (Claude, GPT, etc.) to build a new client site:

---

> ### System Prompt for AI Agent
>
> You are building a new lawn care / landscaping client website from the **Advanced Marketing Dark Luxury Template**. This is a single-page marketing site with a blog page and admin dashboard, built with vanilla HTML, CSS, and JavaScript, deployed on Netlify with serverless functions and Netlify Blobs for data storage.
>
> **Here is the client data:**
> ```json
> {PASTE CLIENT JSON HERE}
> ```
>
> **Follow these steps in order:**
>
> 1. **Create the project folder** at `~/websites/{slug}/` and copy all template files from `~/websites/wildlawn-lawncare/` (exclude `node_modules/`, `.netlify/`, `.git/`).
>
> 2. **Run `npm install`** in the new project directory.
>
> 3. **Customize `index.html`**:
>    - Replace ALL instances of "WildLawn Lawncare LLC", "Wild Lawn Lawncare", "Wild Lawn", and "WildLawn" with the client business name and display name.
>    - Replace ALL phone numbers `(770) 490-2542` and `7704902542` with the client phone.
>    - Replace ALL email addresses `wildlawncare43@gmail.com` with the client email.
>    - Replace the canonical URL `https://wildlawnlawncare.com` with the client URL.
>    - Update ALL meta tags (`<title>`, description, keywords, OG tags, Twitter cards).
>    - Rewrite the Schema.org JSON-LD block with client data (name, address, geo, areaServed, hours, rating).
>    - Update CSS accent colors: replace `#48BB78` with the client accent, `#68D391` with accent-light, `#38A169` with accent-dark. Also replace `rgba(72,187,120,...)` values with RGB equivalents of the new accent.
>    - Replace the services section with client services (cards with images, names, descriptions).
>    - Replace testimonials with client testimonials.
>    - Replace FAQ items with client FAQ data.
>    - Replace service areas with client city descriptions.
>    - Replace pricing packages with client packages.
>    - Update the contact form service `<select>` options to match client services.
>    - Update the hero section content (heading, subtext, stats, image/video).
>    - Update the pain points section with client-specific content.
>    - Update the "Why Us" section with client differentiators.
>    - Update the gallery images.
>    - Update the footer (brand description, services list, contact info, copyright).
>    - Update the floating CTA button phone link.
>    - Update form error messages with client phone.
>
> 4. **Customize `blog.html`**:
>    - Apply the same navigation and footer changes as index.html.
>    - Update all meta tags and Schema.org BlogPosting blocks.
>    - Write 3 SEO-optimized blog articles (1500+ words each) targeting local keywords for the client's service area. Each article should mention the client's cities, services, and include a CTA linking to the contact form.
>
> 5. **Customize `admin.html`**:
>    - Replace business name in title, login card, and topbar.
>    - Replace logo path.
>    - Update accent color references.
>
> 6. **Customize CSS files**:
>    - `css/style.css`: Update `:root` accent color variables.
>    - `css/admin.css`: Update any accent color references.
>
> 7. **Customize JS files**:
>    - `js/main.js`: Replace any hardcoded business names, phone numbers, or accent colors.
>
> 8. **Update `package.json`**: Change `name` and `description`.
>
> 9. **Netlify functions**: No changes needed (they are generic).
>
> 10. **Handle images**: Update `scripts/download-images.js` with appropriate search queries for the client's services, then run it to download stock images. Replace `images/logo.jpg` with the client's actual logo.
>
> 11. **Initialize git** and make an initial commit.
>
> **Important rules:**
> - Do NOT change the overall page structure, layout, or design system. Only swap content and colors.
> - Preserve ALL accessibility attributes (aria-labels, roles, alt text).
> - Ensure ALL phone/email links are functional.
> - Keep the dark luxury aesthetic — only change accent colors, not background or text colors.
> - Blog content must be original, locally-relevant, and SEO-optimized with natural keyword placement.
> - Every `<img>` tag must have a descriptive, keyword-rich alt attribute.
> - Test that the contact form `<select>` options match the services listed on the page.

---

## 5. Design System Reference

### 5.1 Color Palette

| Token | CSS Variable | Default Value | Usage |
|-------|-------------|---------------|-------|
| Background Primary | `--bg-primary` | `#0d0d0d` | Page background |
| Background Secondary | `--bg-secondary` | `#141414` | Cards, sections |
| Background Elevated | `--bg-elevated` | `#1a1a1a` | Modals, dropdowns |
| Accent | `--accent` | `#48BB78` | Buttons, links, highlights |
| Accent Light | `--accent-light` | `#68D391` | Hover states, gradients |
| Accent Dark | `--accent-dark` | `#38A169` | Active states, shadows |
| Text Primary | `--text-primary` | `#f7f5f2` | Headings, body text |
| Text Secondary | `--text-secondary` | `#a8a5a0` | Subtitles, descriptions |
| Text Muted | `--text-muted` | `#6b6965` | Captions, metadata |
| Border | `--border` | `rgba(255,255,255,0.06)` | Card borders, dividers |
| Success | `--success` | `#5a9a6e` | Success states |
| Error | `--error` | `#e55353` | Error states |

**When changing the accent color**, you MUST also update:
- The `rgba()` equivalents used in glow effects (e.g., `rgba(72,187,120,0.15)`)
- The inline `<style>` block in `index.html` that sets `:root` variables
- The `css/style.css` `:root` block
- Any inline `style=""` attributes in `admin.html` that reference `#48BB78`

### 5.2 Typography

| Role | Font Family | CSS Variable | Weights Used |
|------|------------|-------------|--------------|
| Headings | Playfair Display | `--font-heading` | 400, 500, 600, 700, 800 |
| Body | DM Sans | `--font-body` | 300, 400, 500, 600, 700 |

**Loaded via Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 5.3 Spacing

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Section Padding (Desktop) | `--section-pad-desktop` | `100px 0` |
| Section Padding (Mobile) | `--section-pad-mobile` | `60px 0` |
| Container Max Width | — | `1200px` |
| Container Horizontal Padding | — | `0 24px` |
| Card Padding | — | `24px` - `32px` |
| Component Gap | — | `16px` - `24px` |

### 5.4 Border Radii

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Card | `--radius-card` | `12px` |
| Pill | `--radius-pill` | `100px` |
| Button | `--radius-btn` | `8px` |

### 5.5 Transitions

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Fast | `--transition-fast` | `0.2s ease` |
| Base | `--transition-base` | `0.3s ease` |
| Slow | `--transition-slow` | `0.5s ease` |

### 5.6 Component Inventory

| Component | Class | Used In |
|-----------|-------|---------|
| Primary Button | `.btn .btn-primary` | CTAs, form submit |
| Secondary Button | `.btn .btn-secondary` | Alternative actions |
| Service Card | `.service-card` | Services grid |
| Pain Point Card | `.pain-card` | Pain points section |
| Testimonial Card | `.testimonial-card` | Testimonials carousel |
| Pricing Card | `.pricing-card` | Pricing section |
| FAQ Accordion | `.faq-item` + `.faq-question` + `.faq-answer` | FAQ section |
| Section Label | `.section-label` | Above section titles |
| Section Title | `.section-title` | Section headings |
| Section Subtitle | `.section-subtitle` | Below section titles |
| Navbar | `.navbar` | Fixed top navigation |
| Floating CTA | `.floating-cta-wrap` | Bottom-right phone button |
| Back to Top | `.back-to-top` | Bottom-right scroll button |
| Gallery Grid | `.gallery-grid` | Image gallery |
| Footer | `footer` | Page footer |
| Form Group | `.form-group` | Contact form fields |

### 5.7 Page Sections (in order)

1. **Navbar** — Fixed navigation with logo, links, phone CTA, color picker, hamburger menu
2. **Hero** — Full-viewport with video/image background, headline, stats, CTA buttons
3. **Pain Points** — 4-column grid of customer frustrations
4. **Services** — Auto-fit grid of service cards with images
5. **Why Us** — Two-column layout with features list and team image
6. **Testimonials** — Horizontal scrolling testimonial cards
7. **Process** — 4-step "How it works" timeline
8. **Gallery** — Masonry/grid photo gallery
9. **Service Areas** — City cards with SEO descriptions
10. **Pricing** — 3-tier pricing cards
11. **FAQ** — Accordion-style Q&A
12. **Contact** — Two-column form + contact info sidebar
13. **Footer** — 4-column grid with brand, links, services, contact
14. **Floating CTA** — Sticky phone/AI receptionist button
15. **Back to Top** — Scroll-to-top button

---

## Appendix: Quick Find-and-Replace Checklist

For the fastest customization, do a global find-and-replace across all HTML/CSS/JS files for these strings:

| Find | Replace With |
|------|-------------|
| `WildLawn Lawncare LLC` | `{business.name}` |
| `Wild Lawn Lawncare LLC` | `{business.name}` |
| `Wild Lawn Lawncare` | `{business.name}` |
| `Wild Lawn` | `{business.displayName}` |
| `WildLawn` | `{business.displayName}` |
| `wildlawnlawncare.com` | Domain from `{business.url}` |
| `wildlawncare43@gmail.com` | `{business.email}` |
| `(770) 490-2542` | `{business.phone}` |
| `7704902542` | `{business.phoneRaw}` |
| `+17704902542` | `+1{business.phoneRaw}` |
| `Metro Atlanta` | `{business.metro}` |
| `Atlanta` (in address context) | `{business.city}` |
| `GA` (in address context) | `{business.state}` |
| `Georgia` (in content context) | `{business.stateFullName}` |
| `#48BB78` | `{branding.accentColor}` |
| `#68D391` | `{branding.accentLight}` |
| `#38A169` | `{branding.accentDark}` |
| `rgba(72,187,120` | Convert `{branding.accentColor}` to RGB |
| `wildlawn-lawncare` | `{business.slug}` |

> **Warning**: Be careful with city name replacements — "Atlanta" appears in many contexts (blog content, service area descriptions, meta tags). Do NOT blindly replace every instance. Review each occurrence to ensure the replacement makes sense in context.
