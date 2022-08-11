import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {AppModule} from "./app.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";


async function start() {
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule, {
        logger: ['log','error', 'warn', 'debug'],
    })
    app.useGlobalPipes(new ValidationPipe({transform: true}));

    const config = new DocumentBuilder()
        .setTitle('Backend Lesson')
        .setDescription('REST API Documentation')
        .setVersion('0.0.1')
        .addTag('drngk')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
    
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))

}

start()