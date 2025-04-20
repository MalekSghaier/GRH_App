import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CongesController } from './conges.controller';
import { CongesService } from './conges.service';
import { CongeSchema } from '../schemas/conge.schema';
import { User, UserSchema } from '../schemas/user.schema'; // Importez le schéma User
import { UsersModule } from '../users/users.module'; // Importez le UsersModule
import { SoldeCongesModule } from 'src/solde-conges/solde-conges.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Conge', schema: CongeSchema },
    { name: User.name, schema: UserSchema } // Ajoutez le modèle User

  ]),
  UsersModule ,
  SoldeCongesModule// Importez le UsersModule

],
  controllers: [CongesController],
  providers: [CongesService],
  exports: [CongesService],
})
export class CongesModule {}
