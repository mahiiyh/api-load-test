# 🌐 API Load Test Web Interface

Beautiful web interface for running k6 load tests on any API - no installation required!

## 🚀 Live Demo

Visit [loadtest.mahiiyh.me](https://loadtest.mahiiyh.me) (coming soon)

## ✨ Features

- **User-Friendly Interface**: Configure and run API tests through an intuitive web UI
- **Real-Time Visualizations**: Interactive charts showing test metrics and performance
- **Multiple Test Types**: Smoke, Load, Stress, Spike, and Soak tests
- **Custom Configuration**: Set VUs, duration, endpoints, headers, and more
- **Results Dashboard**: Detailed breakdown of request rates, errors, and response times
- **No Installation**: Test any API directly from your browser

## 🛠️ Tech Stack

- **Next.js 14**: App Router, TypeScript
- **Tailwind CSS**: Modern, responsive styling
- **Recharts**: Interactive performance charts
- **Lucide Icons**: Clean, modern iconography
- **Static Export**: Deployed on Cloudflare Pages

## 🏃 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (requires Node.js >= 20.9.0)
npm run build

# Preview production build
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

This app is configured for static export and deployed on Cloudflare Pages.

See [../WEB_DEPLOYMENT.md](../WEB_DEPLOYMENT.md) for complete deployment instructions.

## 🔗 Links

- **CLI Framework**: [Parent Repository](../)
- **Documentation**: [Quick Start](../QUICK_START.md)
- **Deployment Guide**: [WEB_DEPLOYMENT.md](../WEB_DEPLOYMENT.md)

## ⚙️ Configuration

The web interface uses the same core k6 framework from the parent repository. Test configurations and results are visualized in the browser while actual test execution happens via k6.

## 📝 Note

**Node.js Version**: Building this app requires Node.js >= 20.9.0. If deploying via Cloudflare Pages, the correct Node version is used automatically.
