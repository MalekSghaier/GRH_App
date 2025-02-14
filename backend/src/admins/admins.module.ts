//admins.module.ts
import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AdminsController],
  providers: [UsersService],
})
export class AdminsModule {}
