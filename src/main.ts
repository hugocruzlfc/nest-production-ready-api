import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validationExceptionFactory } from './common/pipes/validation-exception.factory';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // @thallesp/nestjs-better-auth re-adds body parsers for non-auth routes.
    bodyParser: false,
  });

  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  // app.useGlobalGuards(new RoleGuard());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
