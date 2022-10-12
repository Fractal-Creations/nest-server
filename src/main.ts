import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {AppModule} from "./app.module";
import { CustomValidationPipe } from "./pipes/validation.pipe";


async function start() {
    console.log(process.env.NODE_ENV);
    
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule, {
        logger: ['log','error', 'warn', 'debug'],
    })
    app.useGlobalPipes(new CustomValidationPipe);
    //app.useGlobalPipes(new ValidationPipe);

    const config = new DocumentBuilder()
        .setTitle('Health Monitoring Backend')
        .setDescription('REST API Documentation')
        .setVersion('0.0.3')
        .addBearerAuth()
        .build()
        

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
    
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))

}

start()