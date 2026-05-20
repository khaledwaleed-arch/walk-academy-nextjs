module.exports = {
  apps: [
    {
      name: "walk-academy",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/root/walk-academy-nextjs",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "/var/log/walk-academy/error.log",
      out_file: "/var/log/walk-academy/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
