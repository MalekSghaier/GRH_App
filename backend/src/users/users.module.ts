//users.module.ts
//Assemble le contrôleur et le service

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../schemas/user.schema'; // Importez UserSchema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Assurez-vous d'utiliser User.name
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}

