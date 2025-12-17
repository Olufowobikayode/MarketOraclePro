// PM2 Ecosystem Configuration for Market Oracle
// This runs both frontend (Vite) and backend (Express) services

module.exports = {
  apps: [
    {
      name: 'market-oracle-backend',
      cwd: './backend',
      script: 'node',
      args: 'server.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'market-oracle-frontend',
      script: 'npx',
      args: 'vite --host 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        VITE_API_URL: 'http://localhost:3001/api'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}
