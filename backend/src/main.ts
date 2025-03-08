//main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200', // Autorise Angular
    credentials: true,
  });

    // Servir les fichiers statiques du dossier "uploads"
    app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
      prefix: '/uploads', // Accès aux fichiers via http://localhost:3000/uploads/
    });

  await app.listen(3000);
}
bootstrap();
