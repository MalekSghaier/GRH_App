//users.module.ts
//Assemble le contrôleur et le service
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../schemas/user.schema'; // Assurez-vous que User est bien importé
import { AdminGuard } from '../auth/admin.guard'; // Import du guard admin

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),  // Utilisation de User.name pour la cohérence
  ],
  controllers: [UsersController],
  providers: [UsersService, AdminGuard],
  exports: [UsersService, MongooseModule], 
})
export class UsersModule {}
