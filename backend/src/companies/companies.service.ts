import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>) {}

  async create(company: Company): Promise<Company> {
    try {
      const createdCompany = new this.companyModel(company);
      return await createdCompany.save();
    } catch (error: unknown) {
      if (this.isMongoDuplicateError(error)) {
        throw new ConflictException('Ce nom ,immatricule fiscale ou e-mail  est déjà utilisé');
      }
      throw error;
    }
  }


  async findByEmail(email: string): Promise<CompanyDocument> {
    const company = await this.companyModel.findOne({ email }).exec();
    if (!company) {
      throw new NotFoundException(`Compagnie avec email ${email} non trouvée`);
    }
    return company;
  }

  async findAll(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException(`Compagnie avec ID ${id} non trouvée`);
    }
    return company;
  }

  async update(id: string, company: Partial<Company>): Promise<Company> {
    const updatedCompany = await this.companyModel
      .findByIdAndUpdate(id, company, { new: true })
      .exec();
    if (!updatedCompany) {
      throw new NotFoundException(`Compagnie avec ID ${id} non trouvée`);
    }
    return updatedCompany;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deletedCompany = await this.companyModel.findByIdAndDelete(id).exec();
    if (!deletedCompany) {
      throw new NotFoundException(`Compagnie avec ID ${id} non trouvée`);
    }
    return { message: 'Compagnie supprimée avec succès' };
  }

  private isMongoDuplicateError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    );
  }
}
