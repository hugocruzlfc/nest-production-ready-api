// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
// import { ApiKeyMiddleware } from './middleware/api-key.middleware';
// import { UserController } from './user/user.controller';

// @Module({
//   imports: [UserModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(ApiKeyMiddleware).forRoutes(UserController);
//   }
// }

import {
  ArcjetGuard,
  ArcjetModule,
  detectBot,
  fixedWindow,
  shield,
} from '@arcjet/nest';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@thallesp/nestjs-better-auth';

import appConfig from './config/app.config';
import arcjetConfig from './config/arcjet.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import loggerConfig from './config/logger.config';
import { validate } from './config/env.validation';
import { auth } from './lib/auth/auth';
import { PrismaModule } from './lib/database/prisma.module';
import { LoggerModule } from './lib/logger/logger.module';
import { UserModule } from './module/user/user.module';
import { ChallengeModule } from './module/challenge/challenge.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig, authConfig, arcjetConfig, loggerConfig],
      validate,
    }),
    AuthModule.forRoot({
      auth,
    }),
    ArcjetModule.forRootAsync({
      isGlobal: true,
      inject: [arcjetConfig.KEY],
      useFactory: (config: ConfigType<typeof arcjetConfig>) => ({
        key: config.key,
        rules: [
          // Shield protects your app from common attacks e.g. SQL injection
          shield({ mode: 'LIVE' }),
          // Create a bot detection rule
          detectBot({
            mode: 'LIVE', // Blocks requests. Use "DRY_RUN" to log only
            // Block all bots except the following
            allow: [
              'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
              // Uncomment to allow these other common bot categories
              // See the full list at https://arcjet.com/bot-list
              //"CATEGORY:MONITOR", // Uptime monitoring services
              //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
            ],
          }),
          // Create a fixed window rate limit. Other algorithms are supported.
          fixedWindow({
            mode: 'LIVE',
            window: '60s', // 10 second fixed window
            max: 2, // Allow a maximum of 2 requests
          }),
        ],
      }),
    }),
    PrismaModule,
    UserModule,
    ChallengeModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ArcjetGuard,
    },
  ],
})
export class AppModule {}
