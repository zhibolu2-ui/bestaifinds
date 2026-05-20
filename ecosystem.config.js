module.exports = {
  apps: [
    {
      name: "bestaifinds",
      script: "npm",
      args: "start",
      cwd: "/var/www/bestaifinds",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      watch: false,
    },
  ],
};
