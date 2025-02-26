//internship-applications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InternshipApplication, InternshipApplicationDocument } from '../schemas/internship-application.schema';

@Injectable()
export class InternshipApplicationsService {
  constructor(
    @InjectModel(InternshipApplication.name) private internshipApplicationModel: Model<InternshipApplicationDocument>,
  ) {}

  async create(data: any): Promise<InternshipApplication> {
    const internshipApplication = new this.internshipApplicationModel(data);
    return internshipApplication.save();
  }

  async findAll(): Promise<InternshipApplication[]> {
    return this.internshipApplicationModel.find().exec();
  }

  async findOne(id: string): Promise<InternshipApplication> {
    const internshipApplication = await this.internshipApplicationModel.findById(id).exec();
    if (!internshipApplication) {
      throw new NotFoundException('Demande non trouvée');
    }
    return internshipApplication;
  }


  
  async update(id: string, updateData: Partial<InternshipApplication>): Promise<{ message: string; data: InternshipApplication }> {
     const internshipApplication = await this.internshipApplicationModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!internshipApplication) {
      throw new NotFoundException('Demande de travail non trouvée');
    }
    return { message: 'Mise à jour effectuée avec succès', data: internshipApplication };
  }

  async delete(id: string): Promise<{ message: string; data: InternshipApplication }> {
    const internshipApplication = await this.internshipApplicationModel.findByIdAndDelete(id).exec();
    if (!internshipApplication) {
      throw new NotFoundException('Demande non trouvée');
    }
    return {
      message: 'Demande supprimée avec succès',
      data: internshipApplication,
    };
  }
  
}
