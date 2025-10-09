/**
 * PM2 Ecosystem Configuration
 * Chạy backend trên nhiều nodes (cluster mode)
 */

module.exports = {
  apps: [{
    name: 'airbnb-backend',
    script: './dist/Main.js',
    
    // Cluster mode - chạy nhiều instances
    instances: 'max',  // Tự động detect số CPU cores
    // Hoặc chỉ định cụ thể: instances: 4
    exec_mode: 'cluster',
    
    // Environment variables
    env: {
      NODE_ENV: 'development',
      API_PORT: 3005,
    },
    env_production: {
      NODE_ENV: 'production',
      API_PORT: 3005,
    },
    
    // Auto-restart configuration
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Memory management
    max_memory_restart: '1G',
    
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Advanced options
    watch: false,  // Set true cho development
    ignore_watch: ['node_modules', 'logs', 'dist'],
    
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    
    // Instance variables
    instance_var: 'INSTANCE_ID',
  }],
  
  // Deploy configuration (optional)
  deploy: {
    production: {
      user: 'node',
      host: ['server1.example.com', 'server2.example.com'],
      ref: 'origin/main',
      repo: 'git@github.com:username/backend.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};

