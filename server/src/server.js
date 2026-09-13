// Application entry point: connect to MongoDB, then start listening.

const app = require("./app");
const { env, checkRequiredEnv } = require("./config/env");
const { connectDatabase } = require("./config/db");

const startServer = async () => {
  checkRequiredEnv();
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`[server] Running in ${env.nodeEnv} mode on http://localhost:${env.port}`);
    console.log(`[server] Health check: http://localhost:${env.port}/api/health`);
  });
};

// If something goes wrong outside a request, log it instead of dying silently.
process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled promise rejection:", reason);
});

startServer();
