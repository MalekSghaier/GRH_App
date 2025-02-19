import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CongesController } from './conges.controller';
import { CongesService } from './conges.service';
import { CongeSchema } from '../schemas/conge.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Conge', schema: CongeSchema }])],
  controllers: [CongesController],
  providers: [CongesService],
  exports: [CongesService],
})
export class CongesModule {}
