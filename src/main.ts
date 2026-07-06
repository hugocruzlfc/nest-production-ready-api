import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // @thallesp/nestjs-better-auth re-adds body parsers for non-auth routes.
    bodyParser: false,
  });

  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new RoleGuard());
  await app.listen(3000);
}
bootstrap();
