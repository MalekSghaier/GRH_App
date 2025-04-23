//users.module.ts
//Assemble le contrôleur et le service
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../schemas/user.schema'; 
import { AdminGuard } from '../auth/admin.guard'; 
import { PointageModule } from 'src/pointage/pointage.module';
import { EmailModule } from '../email/email.module'; // Chemin vers votre EmailModule


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
    PointageModule ,
    EmailModule 
  ],
  controllers: [UsersController],
  providers: [UsersService, AdminGuard],
  exports: [UsersService, MongooseModule], 
})
export class UsersModule {}
