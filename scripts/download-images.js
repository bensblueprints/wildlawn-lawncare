const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES_DIR = path.join(__dirname, '..', 'images');

const IMAGE_JOBS = [
  { file: 'service-mowing.jpg', query: 'lawn mowing', pick: 0 },
  { file: 'service-mulching.jpg', query: 'mulch landscaping', pick: 0 },
  { file: 'service-shrub.jpg', query: 'hedge trimming', pick: 0 },
  { file: 'service-cleanup.jpg', query: 'raking leaves yard', pick: 0 },
  { file: 'service-fertilization.jpg', query: 'lawn care green grass', pick: 0 },
  { file: 'service-landscape-design.jpg', query: 'landscape design garden', pick: 0 },
  { file: 'service-pressure-washing.jpg', query: 'pressure washing', pick: 0 },
  { file: 'hero-bg.jpg', query: 'green lawn house', pick: 0 },
  { file: 'hero-lawn.jpg', query: 'lawn stripes mowing', pick: 0 },
  { file: 'about-team.jpg', query: 'gardener lawn work', pick: 0 },
  { file: 'gallery-1.jpg', query: 'lawn front yard', pick: 0 },
  { file: 'gallery-2.jpg', query: 'flower bed garden', pick: 0 },
  { file: 'gallery-3.jpg', query: 'trimmed hedge garden', pick: 0 },
  { file: 'gallery-4.jpg', query: 'house lawn curb appeal', pick: 0 },
  { file: 'gallery-5.jpg', query: 'backyard patio garden', pick: 0 },
  { file: 'gallery-6.jpg', query: 'green grass neighborhood', pick: 0 },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const ws = fs.createWriteStream(destPath);
      res.pipe(ws);
      ws.on('finish', () => { ws.close(); resolve(); });
      ws.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== WildLawn Image Downloader (Playwright + Pexels) ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
  });

  let success = 0;

  for (const job of IMAGE_JOBS) {
    const page = await context.newPage();
    const dest = path.join(IMAGES_DIR, job.file);
    console.log(`\n[${job.file}] Searching Pexels for: "${job.query}"`);

    try {
      const url = `https://www.pexels.com/search/${encodeURIComponent(job.query)}/`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });

      // Scroll down to trigger lazy load
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);

      // Try multiple selector strategies to find images
      const imgUrl = await page.evaluate((pickIdx) => {
        // Strategy 1: Look for gallery images with data-photo-modal attributes
        let photos = document.querySelectorAll('a[href*="/photo/"] img');
        if (photos.length === 0) {
          // Strategy 2: All images from pexels CDN
          photos = document.querySelectorAll('img[src*="images.pexels.com"], img[data-src*="images.pexels.com"]');
        }
        if (photos.length === 0) {
          // Strategy 3: Any img in article or gallery containers
          photos = document.querySelectorAll('article img, [class*="Gallery"] img, [class*="photo"] img');
        }

        const urls = [];
        for (const img of photos) {
          const src = img.src || img.dataset.src || '';
          if (src && src.includes('pexels.com') && !src.includes('avatar') && !src.includes('logo')) {
            const base = src.split('?')[0];
            if (base.includes('/photos/')) {
              urls.push(base + '?auto=compress&cs=tinysrgb&w=1280');
            }
          }
        }
        return urls.length > pickIdx ? urls[pickIdx] : (urls[0] || null);
      }, job.pick);

      if (!imgUrl) {
        // Fallback: take a screenshot and extract from network requests
        console.log(`  No images found via DOM. Trying network intercept...`);

        // Try getting from page source
        const content = await page.content();
        const match = content.match(/https:\/\/images\.pexels\.com\/photos\/\d+\/[^"'\s?]+/g);
        if (match && match.length > 0) {
          const fallbackUrl = match[job.pick] || match[0];
          const cleanUrl = fallbackUrl.split('?')[0] + '?auto=compress&cs=tinysrgb&w=1280';
          console.log(`  Found via source: ${cleanUrl.substring(0, 80)}...`);
          await downloadFile(cleanUrl, dest);
          console.log(`  Saved: ${job.file}`);
          success++;
        } else {
          console.log(`  FAILED: No Pexels image URLs found for "${job.query}"`);
        }
      } else {
        console.log(`  Downloading: ${imgUrl.substring(0, 80)}...`);
        await downloadFile(imgUrl, dest);
        console.log(`  Saved: ${job.file}`);
        success++;
      }
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\n=== Complete: ${success}/${IMAGE_JOBS.length} images downloaded ===`);
}

main().catch(console.error);
