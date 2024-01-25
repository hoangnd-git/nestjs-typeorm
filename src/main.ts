import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiErrorExceptionFilter } from './filters/api-error-exception.filter';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { kafkaConfigs } from './constants/constants';

const origins = process.env.ORIGIN?.trim()?.split(' ') ?? [''];
const allowedOrigin = origins.length === 1 ? origins.toString() : origins;
const corsOptions = {
  origin: allowedOrigin,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(kafkaConfigs);
  await app.startAllMicroservices();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors(corsOptions);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new ApiErrorExceptionFilter(),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3000;

  const options = new DocumentBuilder()
    .setTitle('Api v1')
    .setDescription('The API doc')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port, async () => {
    console.log(`The server is running on port: ${port}.`);
  });
}
bootstrap();
