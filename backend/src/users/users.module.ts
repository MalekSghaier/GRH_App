//users.module.ts
//Assemble le contrôleur et le service

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from '../schemas/user.schema'; // Importez UserSchema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Utilisez 'User' comme nom de modèle
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
