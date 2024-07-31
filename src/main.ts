import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CustomValidationPipe } from "./pipes/validation.pipe";
import { TransformInterceptor } from "./common/transform.interceptors";


async function start() {
    const PORT = process.env.PORT || 5003
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'error', 'warn', 'debug'],
    });
    app.useGlobalPipes(new ValidationPipe)
        .enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        app.useGlobalInterceptors(new TransformInterceptor());
    //app.useGlobalPipes(new ValidationPipe);

    const config = new DocumentBuilder()
        .setTitle('REST API Системы Возрастного Тестирования')
        .setVersion('0.0.6')
        .addBearerAuth()
        .build()


    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
        
    await app.listen(PORT, () => console.log(`Server started on port = ${ PORT }`))

}

start()