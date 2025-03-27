import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';
import { UsersService } from 'src/users/users.service';
import { MongoServerError } from 'mongodb'; // Importer MongoServerError
import * as bcrypt from 'bcrypt';


@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  private readonly usersService: UsersService, ) {}


  async getStatistics() {
    // Compter le nombre de compagnies
    const totalCompanies = await this.companyModel.countDocuments().exec();

    // Compter le nombre d'employés (role = EMPLOYEE)
    const totalEmployees = await this.usersService.countUsersByRole('employé');

    // Compter le nombre de stagiaires (role = INTERN)
    const totalInterns = await this.usersService.countUsersByRole('stagiaire');

    return {
      totalCompanies,
      totalEmployees,
      totalInterns,
    };
  }
  async create(company: Company): Promise<Company> {
    try {
      const createdCompany = new this.companyModel(company);
      return await createdCompany.save();
    } catch (error: any) { // Typage explicite pour éviter l'erreur TypeScript
      if (error instanceof MongoServerError && error.code === 11000) {
        const keyPattern = error.keyPattern as Record<string, any>; // Typage de keyPattern
        if (keyPattern?.email) {
          throw new ConflictException('Cet email est déjà utilisé.');
        }
        throw new ConflictException('Nom ou immatricule fiscale  déjà utilisé.');
      }
      throw error;
    }
  }


  async searchCompanies(query: string): Promise<Company[]> {
    const regex = new RegExp(query, 'i'); // 'i' pour ignorer la casse
    return this.companyModel.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        { taxId: { $regex: regex } },
      ],
    }).exec();
  }

  
  async findByEmail(email: string): Promise<CompanyDocument> {
    const company = await this.companyModel.findOne({ email }).exec();
    if (!company) {
      throw new NotFoundException(`Compagnie avec email ${email} non trouvée`);
    }
    return company;
  }

  async findAll(page: number = 1, limit: number = 5): Promise<{ data: Company[]; total: number }> {
    const skip = (page - 1) * limit;
    const data = await this.companyModel.find().skip(skip).limit(limit).exec();
    const total = await this.companyModel.countDocuments().exec();
    return { data, total };
  }

  async findById(id: string): Promise<CompanyDocument> {
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException(`Compagnie avec ID ${id} non trouvée`);
    }
    return company;
  }
  async findOne(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException(`Compagnie avec ID ${id} non trouvée`);
    }
    return company;
  }

  async update(id: string, company: Partial<Company>): Promise<Company> {
    try {
    const updatedCompany = await this.companyModel
      .findByIdAndUpdate(id, company, { new: true })
      .exec();
    if (!updatedCompany) {
      throw new NotFoundException(`Compagnie avec ID ${id} non trouvée`);
    }
    return updatedCompany;
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      // Pas besoin de "as MongoServerError" car l'instanceof le garantit déjà
      if (error.keyPattern && 'email' in error.keyPattern) {
        throw new ConflictException('Cet email est déjà utilisé par une autre compagnie');
      }
      throw new ConflictException('Une donnée unique existe déjà');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Une erreur inconnue est survenue');
  }
  }

  async updateProfile(
    companyId: string, 
    updateData: Partial<Pick<CompanyDocument, 'name' | 'address' | 'phone' | 'taxId' | 'email' | 'logo' | 'signature'>>
  ): Promise<CompanyDocument> {
    try {
      const updatedCompany = await this.companyModel.findByIdAndUpdate(
        companyId, 
        updateData, 
        { new: true }
      ).exec();
      
      if (!updatedCompany) {
        throw new NotFoundException(`Compagnie avec ID ${companyId} non trouvée`);
      }
      
      return updatedCompany;
    } catch (error: unknown) {
      if (error instanceof MongoServerError && error.code === 11000) {
        // Pas besoin de "as MongoServerError" car l'instanceof le garantit déjà
        if (error.keyPattern && 'email' in error.keyPattern) {
          throw new ConflictException('Cet email est déjà utilisé par une autre compagnie');
        }
        throw new ConflictException('Une donnée unique existe déjà');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inconnue est survenue');
    }
  }
  async checkPassword(companyId: string, oldPassword: string): Promise<boolean> {
    const company = await this.companyModel.findById(companyId).exec();
    if (!company) {
      throw new NotFoundException(`Compagnie avec ID ${companyId} non trouvée`);
    }
    
    // Vérifier si l'ancien mot de passe correspond
    return bcrypt.compare(oldPassword, company.password);
  }

  async changePassword(companyId: string, newPassword: string): Promise<CompanyDocument> {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      companyId,
      { password: newPassword },
      { new: true }
    ).exec();
    
    if (!updatedCompany) {
      throw new NotFoundException(`Compagnie avec ID ${companyId} non trouvée`);
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
