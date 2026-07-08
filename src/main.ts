import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validationExceptionFactory } from './common/pipes/validation-exception.factory';

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
  const { port } = app.get(appConfig.KEY);
  await app.listen(port);
}
bootstrap();
