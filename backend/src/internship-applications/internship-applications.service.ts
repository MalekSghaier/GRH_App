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

  async create(data: Partial<InternshipApplication>): Promise<InternshipApplication> {
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
}