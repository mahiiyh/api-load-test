'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const router = useRouter();
  const [config, setConfig] = useState({
    url: '',
    method: 'GET',
    testType: 'smoke',
    duration: '30s',
    vus: 1,
    headers: '{}',
    body: ''
  });

  const testTypes = [
    { value: 'smoke', label: '🧪 Smoke Test', desc: 'Minimal load to verify functionality' },
    { value: 'load', label: '📈 Load Test', desc: 'Test under normal expected load' },
    { value: 'stress', label: '⚠️ Stress Test', desc: 'Push beyond normal capacity' },
    { value: 'spike', label: '⚡ Spike Test', desc: 'Sudden burst of traffic' },
    { value: 'soak', label: '⏰ Soak Test', desc: 'Extended duration test' }
  ];

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    try {
      new URL(config.url);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    // For demo, show mock results
    // In production, this would call an API to run k6 tests
    const testId = Date.now().toString();
    router.push(`/results/${testId}?demo=true`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">API LoadTest</span>
          </a>
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

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Configure Your Load Test
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Enter your API details and select a test scenario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API URL */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              API Endpoint URL *
            </label>
            <input
              type="url"
              required
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              placeholder="https://api.example.com/endpoint"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* HTTP Method */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              HTTP Method
            </label>
            <div className="flex flex-wrap gap-3">
              {methods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setConfig({ ...config, method })}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    config.method === method
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Test Type */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Test Scenario
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {testTypes.map((test) => (
                <button
                  key={test.value}
                  type="button"
                  onClick={() => setConfig({ ...config, testType: test.value })}
                  className={`p-4 rounded-xl text-left transition-all ${
                    config.testType === test.value
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="font-semibold mb-1">{test.label}</div>
                  <div className={`text-sm ${config.testType === test.value ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                    {test.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Parameters */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Test Parameters
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={config.duration}
                  onChange={(e) => setConfig({ ...config, duration: e.target.value })}
                  placeholder="30s, 5m, 1h"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Virtual Users (VUs)
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.vus}
                  onChange={(e) => setConfig({ ...config, vus: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Headers */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Headers (JSON)
            </label>
            <textarea
              value={config.headers}
              onChange={(e) => setConfig({ ...config, headers: e.target.value })}
              placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm outline-none"
            />
          </div>

          {/* Request Body */}
          {(config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Request Body (JSON)
              </label>
              <textarea
                value={config.body}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                placeholder='{"key": "value"}'
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm outline-none"
              />
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🚀 Run Load Test
            </button>
            <a
              href="/"
              className="px-8 py-4 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              Cancel
            </a>
          </div>

          {/* Demo Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Demo Mode:</strong> This is a frontend demonstration. To run actual k6 load tests, 
              you'll need to connect a backend API that can execute k6 scripts. Check the{' '}
              <a href="https://github.com/mahiiyh/api-load-test" className="underline">GitHub repository</a>{' '}
              for the CLI version with full k6 integration.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
