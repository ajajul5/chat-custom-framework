module.exports = {
  apps: [
    {
      name: "websocket-server",
      script: "./server.js",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        APP_ENV: "local",
        APP_PORT: 9000
      },
      env_development: {
        APP_ENV: "testing",
        APP_PORT: 9000
      },
      env_production: {
        APP_ENV: "production",
        APP_PORT: 9000
      }
    }
    // Add more configurations as needed
  ]
};
