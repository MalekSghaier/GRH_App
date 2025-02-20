//documents.controller.ts
import { Controller, Post, Get, Delete, UseGuards, Body, Param, UploadedFile, UseInterceptors, Req, UnauthorizedException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserPayload } from '../schemas/user-payload';
import { DocumentDocument } from '../schemas/document.schema';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, callback) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.mimetype)) {
        return callback(new Error('Seuls les fichiers PDF, JPG et PNG sont autorisés'), false);
      }
      callback(null, true);
    },
  }))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() body: { title: string, fileUrl?: string }
  ): Promise<DocumentDocument> {  // ✅ Ajout du type de retour
    const user = req.user as UserPayload;
    if (!user || !user.id) throw new UnauthorizedException('Utilisateur non authentifié');

    if (!file && !body.fileUrl) {
      throw new Error('Aucun fichier n’a été téléchargé.');
    }

    const fileToSave = file ? file.path : body.fileUrl;
    if (!fileToSave || typeof fileToSave !== 'string') {
      throw new Error('Le fichier ou l\'URL du fichier est invalide');
    }

    return this.documentsService.uploadDocument(body.title, fileToSave, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async findAll(): Promise<DocumentDocument[]> {  // ✅ Ajout du type de retour
    return this.documentsService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async deleteDocument(@Param('id') id: string, @Req() req: Request): Promise<{ message: string }> {  // ✅ Ajout du type de retour
    const user = req.user as UserPayload;
    if (!user || !user.id) throw new UnauthorizedException('Utilisateur non authentifié');

    await this.documentsService.deleteDocument(id, user);
    return { message: "Document supprimé avec succès" };
  }
}
