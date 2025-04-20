import {NestFactory} from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    
    app.enableCors({
        origin: true, 
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    
    const config = new DocumentBuilder()
        .setTitle('geoservice')
        .setDescription('документашка потом изменить(добавить)')
        .setVersion('покачто1я')
        .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

   
    await app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port = ${PORT}`));
}

start();
