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
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@thallesp/nestjs-better-auth';

import { auth } from './lib/auth/auth';
import { PrismaModule } from './lib/database/prisma.module';
import { UserModule } from './module/user/user.module';
import { ChallengeModule } from './module/challenge/challenge.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule.forRoot({
      auth,
    }),
    ArcjetModule.forRoot({
      isGlobal: true,
      key: process.env.ARCJET_KEY!,
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
    UserModule,
    ChallengeModule,
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
