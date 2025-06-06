// work-applications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { WorkApplication, WorkApplicationDocument } from '../schemas/work-application.schema';

@Injectable()
export class WorkApplicationsService {
  constructor(
    @InjectModel(WorkApplication.name) private workApplicationModel: Model<WorkApplicationDocument>,
  ) {}

  async create(data: Partial<WorkApplication>): Promise<WorkApplication> {
    // Vérifier si une candidature existe déjà avec le même email et la même entreprise/position
    const existingApplication = await this.workApplicationModel.findOne({
      email: data.email,
      company: data.company,
      position: data.position
    }).exec();
  
    if (existingApplication) {
      throw new Error('Vous avez déjà postulé à cette offre d\'emploi');
    }
  
    const workApplication = new this.workApplicationModel(data);
    return workApplication.save();
  }

  async findAll(): Promise<WorkApplication[]> {
    return this.workApplicationModel.find().exec();
  }

  async findOne(id: string): Promise<WorkApplication> {
    const workApplication = await this.workApplicationModel.findById(id).exec();
    if (!workApplication) {
      throw new NotFoundException('Demande de travail non trouvée');
    }
    return workApplication;
  }

async findByCompany(companyName: string, status?: string): Promise<WorkApplication[]> {
  const query: FilterQuery<WorkApplicationDocument> = { company: companyName };
  
  if (status) {
    // Gérer la correspondance entre 'En attente' (front) et 'En cours de traitement' (back)
    query.status = status === 'En attente' ? 'En cours de traitement' : status;
  }
  
  return this.workApplicationModel.find(query)
    .sort({ createdAt: -1 })
    .exec();
}

  // Dans le service
  async findOneByEmailAndPosition(email: string,company: string,position: string): Promise<WorkApplication | null> {
    return this.workApplicationModel.findOne({email,company,position}).exec();
  }

  async countByCompanyAndStatus(companyName: string, status: string): Promise<number> {
    return this.workApplicationModel.countDocuments({
      company: companyName,
      status: status
    } as FilterQuery<WorkApplicationDocument>).exec();
  }

  async update(id: string, updateData: Partial<WorkApplication>): Promise<{ message: string; data: WorkApplication }> {
    const workApplication = await this.workApplicationModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!workApplication) {
      throw new NotFoundException('Demande de travail non trouvée');
    }
    return { message: 'Mise à jour effectuée avec succès', data: workApplication };
  }
  
  async delete(id: string): Promise<{ message: string; data: WorkApplication }> {
    const workApplication = await this.workApplicationModel.findByIdAndDelete(id).exec();
    if (!workApplication) {
      throw new NotFoundException('Demande de travail non trouvée');
    }
    return { message: 'Suppression effectuée avec succès', data: workApplication };
  }

  async searchApplications(query: string, companyName: string): Promise<WorkApplicationDocument[]> {
    const regex = new RegExp(query, 'i'); // 'i' pour insensible à la casse
    
    return this.workApplicationModel.find({
      company: companyName,
      $or: [
        { position: { $regex: regex } },
        { fullName: { $regex: regex } },
        { email: { $regex: regex } },
        { phone: { $regex: regex } }
      ]
    }).exec();
  }
  
}