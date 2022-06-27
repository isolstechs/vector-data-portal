import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  // app.UseHttpsRedirection();

  // to use helmet (11 to 15 middleware) initialy
  app.use(
    helmet({
      crossOriginEmbedderPolicy: true,
      crossOriginResourcePolicy: true,
      crossOriginOpenerPolicy: true,
      contentSecurityPolicy: false,
    }),
  );

  // to set prefix for databass
  app.setGlobalPrefix('api');

  await app.listen(process.env.port || 3000);
}
bootstrap();
