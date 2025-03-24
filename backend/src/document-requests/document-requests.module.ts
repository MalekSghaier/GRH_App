//document-requests.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from '../documents/documents.controller';
import { DocumentsService } from '../documents/documents.service';
import { Document, DocumentSchema } from '../schemas/document.schema';
import { UsersModule } from '../users/users.module';
import { UserSchema } from '../schemas/user.schema';
import { DocumentRequest, DocumentRequestSchema } from '../schemas/document-request.schema';
import { DocumentRequestsService } from './document-requests.service';
import { DocumentRequestsController } from './document-requests.controller';
import { MailModule } from '../mail/mail.module'; // Ajoutez cette importation


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: 'User', schema: UserSchema },
      { name: DocumentRequest.name, schema: DocumentRequestSchema },
    ]),
    UsersModule,
    MailModule, // Importez le MailModule ici

  ],
  controllers: [DocumentsController, DocumentRequestsController],
  providers: [DocumentsService, DocumentRequestsService],
  exports: [DocumentsService, DocumentRequestsService],
})
export class DocumentRequestsModule {}
