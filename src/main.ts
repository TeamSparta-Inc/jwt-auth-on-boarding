import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filter/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: true,
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Sparta Onboarding - sy.chae')
    .setDescription('온라인 개발팀 온보딩 swagger-ui')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
