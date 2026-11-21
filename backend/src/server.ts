import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ==============================================================
  🚀 FACTORYFLOW ERP (STOCKLEDGER) BACKEND ONLINE
  ==============================================================
  📡 Port: http://localhost:${PORT}
  🔍 Health Check: http://localhost:${PORT}/api/v1/health
  🎯 Benchmark Runner: http://localhost:${PORT}/api/v1/reports/benchmark/run
  🔒 Auth Portal: http://localhost:${PORT}/api/v1/auth/login
  ==============================================================
  `);
});
