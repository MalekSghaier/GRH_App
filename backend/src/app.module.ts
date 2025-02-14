//app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Charge .env globalement
    MongooseModule.forRoot('mongodb://localhost:27017/GRH'),
    UsersModule,
    AuthModule,
    AdminsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
