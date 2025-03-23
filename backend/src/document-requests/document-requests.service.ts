//document-requests.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentRequest, DocumentRequestDocument, RequestStatus } from '../schemas/document-request.schema';

@Injectable()
export class DocumentRequestsService {
  constructor(
    @InjectModel(DocumentRequest.name) private documentRequestModel: Model<DocumentRequestDocument>,
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
}