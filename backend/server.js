const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
