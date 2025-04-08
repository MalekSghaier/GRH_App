//document-requests.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from '../documents/documents.controller';
import { DocumentsService } from '../documents/documents.service';
import { Document, DocumentSchema } from '../schemas/document.schema';
import { UsersModule } from '../users/users.module';
import { EmailModule } from 'src/email/email.module';
import { UserSchema } from '../schemas/user.schema';
import { DocumentRequest, DocumentRequestSchema } from '../schemas/document-request.schema';
import { DocumentRequestsService } from './document-requests.service';
import { DocumentRequestsController } from './document-requests.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: 'User', schema: UserSchema },
      { name: DocumentRequest.name, schema: DocumentRequestSchema },
    ]),
    UsersModule,EmailModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        }
      })
    })
  ],
  controllers: [DocumentsController, DocumentRequestsController],
  providers: [DocumentsService, DocumentRequestsService],
  exports: [DocumentsService, DocumentRequestsService],
})
export class DocumentRequestsModule {}
