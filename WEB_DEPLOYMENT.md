# 🌐 Web Interface Deployment Guide

## 🚀 Deploy to load test.mahiiyh.me

### Prerequisites
- GitHub repository (✅ already done)
- Cloudflare account
- Domain `mahiiyh.me` configured in Cloudflare

---

## Step-by-Step Deployment

### 1. Commit & Push Web App

```bash
cd /Users/mahiiyh/Developer/api-load-test
git add web/
git commit -m "Add web interface for API load testing"
git push origin main
```

### 2. Setup Cloudflare Pages

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Navigate to**: Workers & Pages → Create Application → Pages
3. **Connect Git**: Select "mahiiyh/api-load-test"
4. **Configuration**:
   ```
   Project name: api-loadtest
   Production branch: main
   Build command: cd web && npm install && npm run build
   Build output directory: web/out
   Root directory: /
   Deploy command: (leave EMPTY - Cloudflare auto-deploys static files)
   ```
5. **Environment Variables**: (none required yet)
6. **Deploy**!

**⚠️ IMPORTANT**: Make sure "Deploy command" is EMPTY. Cloudflare Pages automatically deploys the static files from `web/out`. Do NOT set a custom deploy command.

### 3. Configure Custom Domain

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `loadtest.mahiiyh.me`
4. Cloudflare auto-configures DNS (CNAME record)
5. Wait 2-5 minutes for propagation

### 4. Update Next.js for Static Export

The web app needs to be configured for static export to work with Cloudflare Pages:

**File**: `web/next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static HTML export
  images: {
    unoptimized: true,  // Required for static export
  },
  trailingSlash: true,  // Better routing on CDN
};

export default nextConfig;
```

**Update package.json**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### 5. Test Locally

```bash
cd web
npm run build
npx serve out  # Test the static export
```

---

## 🎯 Alternative: GitHub Pages

If you prefer GitHub Pages:

1. **Update** `web/next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/api-load-test',  # Repository name
  images: { unoptimized: true },
};
```

2. **Deploy**:
```bash
npm run build
# Push 'out' folder to gh-pages branch
```

3. **Access at**: `mahiiyh.github.io/api-load-test`

---

## 📊 Current Implementation

### ⚠️ Limitation: Client-Side Only

Since Cloudflare Pages is a static host, k6 cannot run server-side. Two options:

### Option A: Client-Side Demo (Recommended for now)
- Show UI mockup
- Use sample data
- Link to GitHub for actual CLI tool
- **Pros**: Simple, fast, free
- **Cons**: Not actually running k6

### Option B: Separate Backend API
- Deploy backend worker (Cloudflare Workers / Vercel Functions)
- Run k6 on server
- **Pros**: Actually runs k6
- **Cons**: Requires paid infrastructure

**For MVP, I recommend Option A** - Beautiful UI with sample data, 
driving users to the GitHub repo for real usage.

---

## 🎨 What to Build

### Landing Page (/)
- Hero section
- Feature showcase
- Live demo button → /test
- GitHub link

### Test Page (/test)
- API endpoint input
- Test type selector
- "Run Test" button
- Show sample results

### Results Page (/results)
- Mock visualization with sample data
- Charts (response time, throughput)
- Call-to-action: "Want real results? Use the CLI"

---

## 🚀 Quick Deploy Commands

```bash
# 1. Update configuration
echo 'export default { output: "export", images: { unoptimized: true } };' > web/next.config.ts

# 2. Build
cd web && npm run build

# 3. Test locally
npx serve out

# 4. Push to GitHub
git add . && git commit -m "Web app ready for deployment" && git push

# 5. Go to Cloudflare Pages and connect the repo!
```

---

## ✅ Deployment Checklist

- [ ] Web app created in `/web`
- [ ] Next.js configured for static export (`output: 'export'`)
- [ ] Build succeeds locally (`npm run build`)  
- [ ] Pushed to GitHub
- [ ] Connected to Cloudflare Pages
- [ ] Custom domain `loadtest.mahiiyh.me` configured
- [ ] DNS propagated (check: `dig loadtest.mahiiyh.me`)
- [ ] Site accessible at custom domain
- [ ] SSL certificate active (automatic)

---

## 🎉 Post-Deployment

Once live at `loadtest.mahiiyh.me`:

1. Test all pages
2. Share on GitHub README
3. Add to your portfolio  
4. Consider adding backend later for real k6 execution

---

**Need help?** Check Cloudflare Pages docs: https://developers.cloudflare.com/pages/
