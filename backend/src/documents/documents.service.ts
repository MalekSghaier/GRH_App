//documents.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentDocument, Document } from '../schemas/document.schema';
import { UserPayload } from '../schemas/user-payload';
import { UserRole } from 'src/schemas/user.schema';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Document.name) private documentModel: Model<DocumentDocument>) {}

  async uploadDocument(title: string, fileUrl: string, uploadedBy: UserPayload): Promise<DocumentDocument> {
    console.log("UserPayload reçu:", uploadedBy); // DEBUG

    if (uploadedBy.role !== UserRole.ADMIN.toString()) { // Correction ici
      throw new ForbiddenException("Seuls les administrateurs peuvent ajouter des documents.");
    }

    // ✅ Correction : Utiliser `create` pour éviter l'erreur .save() sur une valeur potentiellement non définie
    const newDocument = await this.documentModel.create({ title, fileUrl, uploadedBy: uploadedBy.id });

    return newDocument;
  }

  async findAll(): Promise<DocumentDocument[]> {
    console.log("🔍 Récupération de tous les documents...");
    return this.documentModel.find().populate('uploadedBy', 'name email').exec();
  }

  async deleteDocument(id: string, user: UserPayload): Promise<void> {
    const document = await this.documentModel.findById(id);
    if (!document) throw new NotFoundException("Document non trouvé");

    if (user.role !== UserRole.ADMIN.toString()) { // Correction ici
      throw new ForbiddenException("Seuls les administrateurs peuvent supprimer des documents.");
    }

    await this.documentModel.deleteOne({ _id: id });
  }
}
