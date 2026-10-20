import { app } from './app.js';
import { env } from './config/env.config.js';
import { connectDatabase, disconnectDatabase } from './config/db.config.js';
import { logger } from './utils/logger.util.js';
import { Server } from 'http';

let server: Server | null = null;

async function startServer(): Promise<void> {
  try {
    // 1. Establish Database Connection (skip if disabled or handled in tests)
    if (env.NODE_ENV !== 'test') {
      await connectDatabase();
    }

    // 2. Bind HTTP Server
    server = app.listen(env.PORT, () => {
      logger.info(
        `🚀 CodeDrill Backend listening on http://localhost:${env.PORT} [Environment: ${env.NODE_ENV}]`
      );
    });

    // 3. Register Graceful Shutdown Traps
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Initiating graceful shutdown...`);

      if (server) {
        server.close(async () => {
          logger.info('HTTP server closed');
          await disconnectDatabase();
          process.exit(0);
        });

        // Force termination if cleanup takes longer than 10 seconds
        setTimeout(() => {
          logger.error('Forced shutdown due to timeout');
          process.exit(1);
        }, 10000).unref();
      } else {
        process.exit(0);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.fatal({ error }, 'Fatal error during server startup');
    process.exit(1);
  }
}

// Automatically start if executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { server, startServer };
