import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document, DocumentSchema } from '../schemas/document.schema';
import { UsersModule } from '../users/users.module'; // Importez le module UsersModule
import { UserSchema } from '../schemas/user.schema';  // 👈 Importation du modèle User


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }, { name: 'User', schema: UserSchema },  // 👈 Enregistrement du modèle User
    ]),
    
    UsersModule, // Importez le module UsersModule ici
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}