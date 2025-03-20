//service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IConge } from '../schemas/conge.schema';

@Injectable()
export class CongesService {
  constructor(@InjectModel('Conge') private readonly congeModel: Model<IConge>) {}

  async create(userId: string, data: Partial<IConge>): Promise<IConge> {
    return this.congeModel.create({ ...data, userId });
  }

  async findByUser(userId: string): Promise<IConge[]> {
    return this.congeModel.find({ userId }).exec();
  }

  async findAll(): Promise<IConge[]> {
    return this.congeModel.find().populate('userId', 'name email').exec(); // Inclure le nom et l'email de l'utilisateur
  }

  async findAllPending(): Promise<IConge[]> {
    return this.congeModel.find({ status: 'pending' }).populate('userId', 'name email').exec();
  }

  async countPendingConges(): Promise<number> {
     return this.congeModel.countDocuments({ status: 'pending' }).exec();
  }

  async update(id: string, data: Partial<IConge>): Promise<IConge> {
    const conge = await this.congeModel.findByIdAndUpdate(id, data, { new: true });
    if (!conge) throw new NotFoundException("Congé non trouvé");
    return conge;
  }

  async delete(id: string): Promise<void> {
    const result = await this.congeModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException("Congé non trouvé");
  }
}
