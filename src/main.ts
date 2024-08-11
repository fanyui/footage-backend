import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('Security API')
    .setDescription('The Security Footage Analyisis management')
    .setVersion('1.0')
    .addTag('security')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? 8080;
  await app.listen(port, host, () =>
    console.log(`\nListening on ${host}:${port}\n`),
  );
}
bootstrap();
