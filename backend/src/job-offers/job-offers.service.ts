import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JobOffer, JobOfferDocument } from '../schemas/job-offer.schema';

@Injectable()
export class JobOffersService {
  constructor(
    @InjectModel(JobOffer.name) private jobOfferModel: Model<JobOfferDocument>
  ) {}

  async create(offerData: {
    title: string;
    description: string;
    company: string;
    location: string;
    experienceRequired: number;
    educationLevel: string;
    jobRequirements: string;
    createdBy: Types.ObjectId;
  }): Promise<JobOfferDocument> {
    const createdOffer = new this.jobOfferModel(offerData);
    return createdOffer.save();
  }

  async findAll(): Promise<JobOfferDocument[]> {
    return this.jobOfferModel.find().exec();
  }

  async findByCompany(companyId: string): Promise<JobOfferDocument[]> {
    return this.jobOfferModel
      .find({ createdBy: new Types.ObjectId(companyId) })
      .sort({ createdAt: -1 }) // Tri par date décroissante
      .exec();
  
  }

  async findById(id: string): Promise<JobOfferDocument | null> {
    return this.jobOfferModel.findById(id).exec();
  }

  async update(
    id: string, 
    offerData: Partial<{
      title: string;
      description: string;
      company: string;
      location: string;
      experienceRequired: number;
      educationLevel: string;
      jobRequirements: string;
      createdBy?: never; // Indique explicitement que ce champ ne doit pas être utilisé
    }>
  ): Promise<JobOfferDocument | null> {
    // Créer une copie des données sans createdBy
    const updateData = {...offerData};
    delete updateData.createdBy;
    
    return this.jobOfferModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<JobOfferDocument | null> {
    return this.jobOfferModel.findByIdAndDelete(id).exec();
  }

  async countByCompany(companyId: string): Promise<number> {
    return this.jobOfferModel
      .countDocuments({ createdBy: new Types.ObjectId(companyId) })
      .exec();
  }

  async searchJobOffers(query: string, companyId?: Types.ObjectId): Promise<JobOfferDocument[]> {
    const regex = new RegExp(query, 'i'); // 'i' pour insensible à la casse
    
    const searchConditions: any = {
      $or: [
        { title: { $regex: regex } },
        { jobRequirements: { $regex: regex } }
      ]
    };
  
    // Si companyId est fourni, on filtre aussi par entreprise
    if (companyId) {
      searchConditions.createdBy = companyId;
    }
  
    return this.jobOfferModel.find(searchConditions).exec();
  }

    async publicSearchOffers(
      query: string,
      experienceRequired?: number,
      educationLevel?: string,
      jobRequirements?: string 
    ): Promise<JobOfferDocument[]> {
      const searchConditions: any = {};
      
      // Recherche texte sur plusieurs champs
      if (query && query.trim() !== '') {
        const regex = new RegExp(query, 'i');
        searchConditions.$or = [
          { title: { $regex: regex } },        // Poste
          { company: { $regex: regex } },      // Entreprise
          { location: { $regex: regex } },     // Lieu
          { jobRequirements: { $regex: regex } }  
        ];
      }
    
      // Filtres avancés
      if (experienceRequired) {
        searchConditions.experienceRequired = experienceRequired; 
      }
    
      if (educationLevel) {
        searchConditions.educationLevel = educationLevel;
      }
    
      if (jobRequirements) {
        searchConditions.jobRequirements = { $regex: new RegExp(jobRequirements, 'i') };
      }
    
      // Si aucun critère n'est spécifié, retourner toutes les offres
      if (Object.keys(searchConditions).length === 0) {
        return this.jobOfferModel.find().exec();
      }
    
      return this.jobOfferModel.find(searchConditions).exec();
    }
}