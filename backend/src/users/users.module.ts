//users.module.ts
//Assemble le contrôleur et le service
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../schemas/user.schema'; 
import { AdminGuard } from '../auth/admin.guard'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),  
  ],
  controllers: [UsersController],
  providers: [UsersService, AdminGuard],
  exports: [UsersService, MongooseModule], 
})
export class UsersModule {}
