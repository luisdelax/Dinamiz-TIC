module.exports = {
  apps: [{
    name: 'dinamiz-tic',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/dinamiz-tic',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0',
      AI_PROVIDER: 'openai'
    }
  }]
}
