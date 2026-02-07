import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as https from 'https';
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./core/interceptors/transform.interceptors";

async function start() {
  // Настройки HTTPS
  const httpsOptions = {
    key: fs.readFileSync('./ssl/private-key.pem'), // Путь к приватному ключу
    cert: fs.readFileSync('./ssl/certificate.pem'), // Путь к сертификату
  };

  const PORT = process.env.PORT || 5003;
  
  // Создаем HTTPS приложение
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: ['log', 'error', 'warn', 'debug'],
  });
  
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe())
    .enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('REST API Системы Возрастного Тестирования')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT} (HTTPS)`))
}

start()