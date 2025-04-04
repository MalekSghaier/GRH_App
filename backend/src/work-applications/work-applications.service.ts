// work-applications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkApplication, WorkApplicationDocument } from '../schemas/work-application.schema';

@Injectable()
export class WorkApplicationsService {
  constructor(
    @InjectModel(WorkApplication.name) private workApplicationModel: Model<WorkApplicationDocument>,
  ) {}

  async create(data: any): Promise<WorkApplication> {
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

  async findByCompany(companyName: string): Promise<WorkApplication[]> {
    return this.workApplicationModel.find({ company: companyName }).exec();
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
  
}