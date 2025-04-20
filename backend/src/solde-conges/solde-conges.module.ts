// solde-conges.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { SoldeCongesService } from './solde-conges.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [SoldeCongesService],
  exports: [SoldeCongesService] // Important pour pouvoir l'utiliser ailleurs
})
export class SoldeCongesModule {}