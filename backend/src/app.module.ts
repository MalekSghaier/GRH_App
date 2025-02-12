import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module'; // Importez UsersModule

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'), // Remplacez 'nestjs-db' par le nom de votre base de données
    UsersModule, // Importez UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
