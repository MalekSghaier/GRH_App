//document-requests.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentRequest, DocumentRequestDocument, RequestStatus } from '../schemas/document-request.schema';
import { User, UserDocument } from '../schemas/user.schema';


@Injectable()
export class DocumentRequestsService {
  constructor(  
    @InjectModel(DocumentRequest.name) private documentRequestModel: Model<DocumentRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument> ,

  ) {}

  async createRequest(data: Partial<DocumentRequest>): Promise<DocumentRequestDocument> {
    const newRequest = new this.documentRequestModel(data);
    return await newRequest.save();
  }

  async findRequestsByUser(userId: string): Promise<DocumentRequestDocument[]> {
    return this.documentRequestModel.find({ userId }).exec();
  }

  async findAllRequests(): Promise<DocumentRequestDocument[]> {
    return this.documentRequestModel.find().exec();
  }

  async findAll(): Promise<DocumentRequestDocument[]> {
    return this.documentRequestModel.find().exec();
  }

  async findRequestById(id: string): Promise<DocumentRequestDocument> {
    const request = await this.documentRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException(`Demande avec ID ${id} non trouvée`);
    }
    return request;
  }

  async updateRequestStatus(id: string, status: RequestStatus): Promise<DocumentRequestDocument> {
    const request = await this.documentRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();
    if (!request) {
      throw new NotFoundException(`Demande avec ID ${id} non trouvée`);
    }
    return request;
  }

  async countPendingDocs(): Promise<number> {
    return this.documentRequestModel.countDocuments({ status: 'En attente' }).exec();
 }
async findByCompanyPaginated(
  company: string,
  page: number = 1,
  limit: number = 5,
  status?: RequestStatus // Utiliser l'enum directement
): Promise<{ data: DocumentRequestDocument[]; total: number }> {
  const users = await this.userModel.find({
    company,
    role: { $in: ['employé', 'stagiaire'] }
  }).select('_id').lean();

  const userIds = users.map(user => user._id);

  const skip = (page - 1) * limit;

  const filter: any = { userId: { $in: userIds } };
  
  // Ajouter le filtre de statut seulement si spécifié
  if (status) {
    filter.status = status;
  }

  const [data, total] = await Promise.all([
    this.documentRequestModel.find(filter)
      .populate('userId', 'name email role company')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
    
    this.documentRequestModel.countDocuments(filter).exec()
  ]);

  return { data, total };
}

async countPendingByCompany(company: string): Promise<number> {
  const users = await this.userModel.find({
    company,
    role: { $in: ['employé', 'stagiaire'] }
  }).select('_id').lean();

  const userIds = users.map(user => user._id);

  return this.documentRequestModel.countDocuments({ 
    userId: { $in: userIds },
    status: 'En attente' 
  }).exec();
}

async delete(id: string): Promise<{ message: string }> {
  const deletedRequest = await this.documentRequestModel.findByIdAndDelete(id).exec();
  if (!deletedRequest) {
    throw new NotFoundException(`Demande avec ID ${id} non trouvée`);
  }
  return { message: 'Demande de document supprimée avec succès' };
}

async getDocumentStatsByCompany(company: string): Promise<{
  pending: number;
  in_progress: number;
  approved: number;
  rejected: number;
}> {
  // Trouver les utilisateurs de la compagnie
  const users = await this.userModel.find({
    company,
    role: { $in: ['employé', 'stagiaire'] }
  }).select('_id').lean();

  const userIds = users.map(user => user._id);

  const [pending, in_progress, approved, rejected] = await Promise.all([
    this.documentRequestModel.countDocuments({ 
      userId: { $in: userIds },
      status: RequestStatus.PENDING
    }),
    this.documentRequestModel.countDocuments({ 
      userId: { $in: userIds },
      status: RequestStatus.IN_PROGRESS
    }),
    this.documentRequestModel.countDocuments({ 
      userId: { $in: userIds },
      status: RequestStatus.APPROVED
    }),
    this.documentRequestModel.countDocuments({ 
      userId: { $in: userIds },
      status: RequestStatus.REJECTED
    })
  ]);

  return { pending, in_progress, approved, rejected };
}

}