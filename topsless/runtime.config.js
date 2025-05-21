module.exports = {
  apps: [
    {
      name: "topsless-service",
      script: "./service.js",
      watch: false,
      restart_delay: 2000, // optional delay before restarting
      max_restarts: 5,     // max restarts to avoid loops
    },
  ]
};
