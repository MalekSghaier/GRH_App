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
  limit: number = 5
): Promise<{ data: DocumentRequestDocument[]; total: number }> {
  // Trouver les utilisateurs de la compagnie
  const users = await this.userModel.find({
    company,
    role: { $in: ['employé', 'stagiaire'] }
  }).select('_id').lean();

  const userIds = users.map(user => user._id);

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.documentRequestModel.find({ 
      userId: { $in: userIds },
      status: 'En attente' // Filtre ajouté ici
    })
    .populate('userId', 'name email role company')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec(),
    
    this.documentRequestModel.countDocuments({ 
      userId: { $in: userIds },
      status: 'En attente' // Filtre ajouté ici aussi
    }).exec()
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

async getDocumentStatsByCompany(company: string): Promise<{
  pending: number;
  approved: number;
  rejected: number;
}> {
  // Trouver les utilisateurs de la compagnie
  const users = await this.userModel.find({
    company,
    role: { $in: ['employé', 'stagiaire'] }
  }).select('_id').lean();

  const userIds = users.map(user => user._id);

  const [pending, approved, rejected] = await Promise.all([
    this.documentRequestModel.countDocuments({ 
      userId: { $in: userIds },
      status: RequestStatus.PENDING
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

  return { pending, approved, rejected };
}

}