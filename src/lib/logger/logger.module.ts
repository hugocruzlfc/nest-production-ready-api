import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';

import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import appConfig from '../../config/app.config';
import loggerConfig from '../../config/logger.config';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [appConfig.KEY, loggerConfig.KEY],
      useFactory: (
        app: ConfigType<typeof appConfig>,
        logger: ConfigType<typeof loggerConfig>,
      ) => ({
        pinoHttp: {
          level: logger.level,
          genReqId: (req: IncomingMessage) => {
            const existing = req.headers['x-request-id'];
            return Array.isArray(existing)
              ? existing[0]
              : (existing ?? randomUUID());
          },
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              'res.headers["set-cookie"]',
            ],
            censor: '[Redacted]',
          },
          transport:
            app.nodeEnv === 'development'
              ? { target: 'pino-pretty', options: { singleLine: true } }
              : undefined,
        },
      }),
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
