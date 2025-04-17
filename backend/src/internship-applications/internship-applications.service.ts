// src/internship-applications/internship-applications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { InternshipApplication, InternshipApplicationDocument } from '../schemas/internship-application.schema';

@Injectable()
export class InternshipApplicationsService {
  constructor(
    @InjectModel(InternshipApplication.name) 
    private internshipApplicationModel: Model<InternshipApplicationDocument>,
  ) {}

  // src/internship-applications/internship-applications.service.ts
async create(data: Partial<InternshipApplication>): Promise<InternshipApplication> {
  // Vérifier si une candidature existe déjà avec le même email et la même entreprise/position
  const existingApplication = await this.internshipApplicationModel.findOne({
    email: data.email,
    company: data.company,
    position: data.position
  }).exec();

  if (existingApplication) {
    throw new Error('Vous avez déjà postulé à cette offre de stage');
  }

  const internshipApplication = new this.internshipApplicationModel(data);
  return internshipApplication.save();
}
  async findAll(): Promise<InternshipApplication[]> {
    return this.internshipApplicationModel.find().exec();
  }

  async findOne(id: string): Promise<InternshipApplication> {
    const internshipApplication = await this.internshipApplicationModel.findById(id).exec();
    if (!internshipApplication) {
      throw new NotFoundException('Demande de stage non trouvée');
    }
    return internshipApplication;
  }

  async findByCompany(companyName: string, status?: string): Promise<InternshipApplication[]> {
    const query: FilterQuery<InternshipApplicationDocument> = { company: companyName };
    if (status) {
      query.status = status;
    }
    return this.internshipApplicationModel.find(query).exec();
  }

  async countByCompanyAndStatus(companyName: string, status: string): Promise<number> {
    return this.internshipApplicationModel.countDocuments({
      company: companyName,
      status: status
    } as FilterQuery<InternshipApplicationDocument>).exec();
  }

  async update(
    id: string, 
    updateData: Partial<InternshipApplication>
  ): Promise<{ message: string; data: InternshipApplication }> {
    const internshipApplication = await this.internshipApplicationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!internshipApplication) {
      throw new NotFoundException('Demande de stage non trouvée');
    }
    
    return { 
      message: 'Mise à jour effectuée avec succès', 
      data: internshipApplication 
    };
  }

  async delete(id: string): Promise<{ message: string; data: InternshipApplication }> {
    const internshipApplication = await this.internshipApplicationModel.findByIdAndDelete(id).exec();
    if (!internshipApplication) {
      throw new NotFoundException('Demande de stage non trouvée');
    }
    return { 
      message: 'Suppression effectuée avec succès', 
      data: internshipApplication 
    };
  }

  async searchApplications(query: string, companyName: string): Promise<InternshipApplicationDocument[]> {
    const regex = new RegExp(query, 'i'); // 'i' pour insensible à la casse
    
    return this.internshipApplicationModel.find({
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