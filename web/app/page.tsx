export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">API LoadTest</span>
          </div>
          <a
            href="https://github.com/mahiiyh/api-load-test"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            GitHub →
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Powered by k6
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Professional API Load Testing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              Made Simple
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            Test any REST API with production-ready k6 scenarios. Get detailed performance metrics, 
            identify bottlenecks, and ensure your API can handle the load.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/test"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🚀 Start Testing Now
            </a>
            <a
              href="https://github.com/mahiiyh/api-load-test"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Multiple Test Scenarios
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Smoke, Load, Stress, Spike, and Soak tests. Choose the right scenario for your needs.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Detailed Metrics
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Request duration, failure rates, throughput, and custom thresholds with performance insights.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔧</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Easy Configuration
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Environment-based config, JWT authentication, and modular structure for any API.
            </p>
          </div>
        </div>

        {/* Test Types */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 shadow-xl border border-slate-200 dark:border-slate-700 mb-20">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Comprehensive Test Suite
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: '🧪 Smoke Test', desc: 'Verify basic functionality' },
              { name: '📈 Load Test', desc: 'Test under expected load' },
              { name: '⚠️ Stress Test', desc: 'Find breaking points' },
              { name: '⚡ Spike Test', desc: 'Handle sudden traffic surges' },
              { name: '⏰ Soak Test', desc: 'Long-duration stability' },
              { name: '🔐 Auth Support', desc: 'JWT token authentication' }
            ].map((test, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <span className="text-xl">{test.name.split(' ')[0]}</span>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{test.name.substring(3)}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{test.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-12 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Test Your API?
          </h2>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
            Clone the repository, configure your API endpoints, and start load testing in minutes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/test"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Demo Now →
            </a>
            <a
              href="https://github.com/mahiiyh/api-load-test"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-blue-600 text-white border-2 border-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Get Started on GitHub
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-slate-600 dark:text-slate-400">
          <p>Built with k6, Next.js, and ❤️ by <a href="https://github.com/mahiiyh" className="text-blue-600 dark:text-blue-400 hover:underline">mahiiyh</a></p>
        </div>
      </footer>
    </div>
  );
}
