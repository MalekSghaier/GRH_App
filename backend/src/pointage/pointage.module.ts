import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PointageService } from './pointage.service';
import { PointageController } from './pointage.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Pointage, PointageSchema } from '../schemas/pointage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Pointage.name, schema: PointageSchema }
    ])
  ],
  controllers: [PointageController],
  providers: [PointageService],
  exports: [PointageService]
})
export class PointageModule {}