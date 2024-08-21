import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http';
import * as https from 'https';
import { SunriseModule } from './src/sunrise.module';
import PresentationSettings from 'src/infrastructure/presentation/settings/PresentationSettings';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as express from 'express';
import { ShutdownObserver } from 'src/ShutdownObserver';

async function bootstrap() {  
  const server = express();
  const app = await NestFactory.create(
    SunriseModule,
    new ExpressAdapter(server),
  );

  const config = new DocumentBuilder()
    .setTitle('Sunrise')
    .setDescription('Halo 3 Web API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.init();
  
  const httpServer = http.createServer(server).listen(process.env.HTTP_PORT);

  const shutdownObserver = app.get(ShutdownObserver);
  shutdownObserver.addHttpServer(httpServer);

  if (process.env.USE_HTTPS=== 'true') {
    const httpsOptions = {
      key: readFileSync(process.env.SSL_PRIVATE_KEY_PATH),
      cert: readFileSync(process.env.SSL_CERTIFICATE_PATH),
    };
    const httpsServer = https.createServer(httpsOptions, server).listen(process.env.HTTPS_PORT);
    shutdownObserver.addHttpServer(httpsServer);
  }
}
bootstrap();
