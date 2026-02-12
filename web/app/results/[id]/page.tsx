'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';

  // Mock data for demonstration
  const responseTimeData = [
    { time: '0s', min: 45, avg: 120, max: 250, p95: 210 },
    { time: '10s', min: 48, avg: 125, max: 280, p95: 230 },
    { time: '20s', min: 52, avg: 130, max: 290, p95: 245 },
    { time: '30s', min: 50, avg: 128, max: 275, p95: 235 },
    { time: '40s', min: 47, avg: 122, max: 260, p95: 220 },
    { time: '50s', min: 49, avg: 126, max: 270, p95: 228 },
    { time: '60s', min: 46, avg: 121, max: 255, p95: 215 },
  ];

  const throughputData = [
    { time: '0s', requests: 15 },
    { time: '10s', requests: 18 },
    { time: '20s', requests: 20 },
    { time: '30s', requests: 19 },
    { time: '40s', requests: 21 },
    { time: '50s', requests: 20 },
    { time: '60s', requests: 18 },
  ];

  const statusCodeData = [
    { code: '200 OK', count: 1247 },
    { code: '201 Created', count: 89 },
    { code: '400 Bad Request', count: 3 },
    { code: '500 Error', count: 1 },
  ];

  const summary = {
    totalRequests: 1340,
    successRate: 99.7,
    avgResponseTime: 125,
    p95ResponseTime: 228,
    maxResponseTime: 290,
    throughput: 22.3,
    duration: '60s',
    vus: 5
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
          <div className="flex gap-4 items-center">
            <a
              href="/test"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              New Test
            </a>
            <a
              href="https://github.com/mahiiyh/api-load-test"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              GitHub →
            </a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Test Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Load Test Results
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Test ID: {params.id} {isDemo && <span className="text-yellow-600 dark:text-yellow-400">(Demo Data)</span>}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-xl font-semibold ${
              summary.successRate >= 99 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
            }`}>
              {summary.successRate >= 99 ? '✅ Passed' : '⚠️ Warning'}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Total Requests</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{summary.totalRequests.toLocaleString()}</div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Success Rate</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{summary.successRate}%</div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Avg Response Time</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.avgResponseTime}ms</div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Throughput</div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{summary.throughput} req/s</div>
          </div>
        </div>

        {/* Response Time Chart */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Response Time Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="min" stroke="#10b981" strokeWidth={2} name="Min" />
              <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={3} name="Average" />
              <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} name="P95" />
              <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} name="Max" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Throughput Chart */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Request Throughput</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" label={{ value: 'Requests/sec', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="requests" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Codes */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">HTTP Status Codes</h2>
          <div className="space-y-4">
            {statusCodeData.map((status, i) => {
              const percentage = (status.count / summary.totalRequests * 100).toFixed(1);
              const isSuccess = status.code.startsWith('2');
              const isError = status.code.startsWith('4') || status.code.startsWith('5');
              
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32 text-slate-900 dark:text-white font-medium">{status.code}</div>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-full h-6 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        isSuccess ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-24 text-right text-slate-600 dark:text-slate-400">
                    {status.count} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Detailed Metrics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Response Times</h3>
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Average:</span>
                  <span className="font-semibold">{summary.avgResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>95th Percentile:</span>
                  <span className="font-semibold">{summary.p95ResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum:</span>
                  <span className="font-semibold">{summary.maxResponseTime}ms</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Test Configuration</h3>
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">{summary.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Virtual Users:</span>
                  <span className="font-semibold">{summary.vus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Throughput:</span>
                  <span className="font-semibold">{summary.throughput} req/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <a
            href="/test"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            Run Another Test
          </a>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            Export Report
          </button>
        </div>
      </main>
    </div>
  );
}
