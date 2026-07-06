import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new RoleGuard());
  await app.listen(3000);
}
bootstrap();
