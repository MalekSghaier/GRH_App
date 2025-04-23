//admins.module.ts
import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';
import { PointageModule } from 'src/pointage/pointage.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  UsersModule,
  EmailModule,
  PointageModule,
 ],
  controllers: [AdminsController],
  providers: [UsersService],
})
export class AdminsModule {}
