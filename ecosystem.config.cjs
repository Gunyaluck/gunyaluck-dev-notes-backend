/** @type {import('pm2').StartOptions[]} */
module.exports = {
  apps: [
    {
      name: "gunyaluck-dev-notes-backend",
      script: "app.mjs",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
