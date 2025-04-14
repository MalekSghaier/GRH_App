// src/internship-offers/internship-offers.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InternshipOffer, InternshipOfferDocument } from '../schemas/internship-offer.schema';

@Injectable()
export class InternshipOffersService {
  constructor(
    @InjectModel(InternshipOffer.name) 
    private internshipOfferModel: Model<InternshipOfferDocument>
  ) {}

  async create(offerData: {
    title: string;
    description: string;
    company: string;
    location: string;
    duration: number;
    educationLevel: string;
    requirements: string;
    createdBy: Types.ObjectId;
  }): Promise<InternshipOfferDocument> {
    const createdOffer = new this.internshipOfferModel(offerData);
    return createdOffer.save();
  }

  async findAll(): Promise<InternshipOfferDocument[]> {
    return this.internshipOfferModel.find().exec();
  }

  async findByCompany(companyId: string): Promise<InternshipOfferDocument[]> {
    return this.internshipOfferModel
      .find({ createdBy: new Types.ObjectId(companyId) })
      .exec();
  }

  async findById(id: string): Promise<InternshipOfferDocument | null> {
    return this.internshipOfferModel.findById(id).exec();
  }

  async update(
    id: string, 
    offerData: Partial<{
      title: string;
      description: string;
      company: string;
      location: string;
      duration: number;
      educationLevel: string;
      requirements: string;
    }>
  ): Promise<InternshipOfferDocument | null> {
    return this.internshipOfferModel
      .findByIdAndUpdate(id, offerData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<InternshipOfferDocument | null> {
    return this.internshipOfferModel.findByIdAndDelete(id).exec();
  }

  async countByCompany(companyId: string): Promise<number> {
    return this.internshipOfferModel
      .countDocuments({ createdBy: new Types.ObjectId(companyId) })
      .exec();
  }

  async searchOffers(query: string, companyId?: Types.ObjectId): Promise<InternshipOfferDocument[]> {
    const regex = new RegExp(query, 'i'); // 'i' pour insensible à la casse
    
    const searchConditions: any = {
      $or: [
        { title: { $regex: regex } },
        { requirements: { $regex: regex } }
      ]
    };
  
    // Si companyId est fourni, on filtre aussi par entreprise
    if (companyId) {
      searchConditions.createdBy = companyId;
    }
  
    return this.internshipOfferModel.find(searchConditions).exec();
  }

  async publicSearchOffers(
    query: string,
    duration?: number,
    educationLevel?: string,
    requirements?: string
  ): Promise<InternshipOfferDocument[]> {
    const searchConditions: any = {};
    
    // Recherche texte sur plusieurs champs
    if (query && query.trim() !== '') {
      const regex = new RegExp(query, 'i');
      searchConditions.$or = [
        { title: { $regex: regex } },        // Poste
        { company: { $regex: regex } },      // Entreprise
        { location: { $regex: regex } },     // Lieu
        { requirements: { $regex: regex } }  // Exigences
      ];
    }
  
    // Filtres avancés
    if (duration) {
      searchConditions.duration = { $eq: duration };
    }
  
    if (educationLevel) {
      searchConditions.educationLevel = educationLevel;
    }
  
    if (requirements) {
      searchConditions.requirements = { $regex: new RegExp(requirements, 'i') };
    }
  
    // Si aucun critère n'est spécifié, retourner toutes les offres
    if (Object.keys(searchConditions).length === 0) {
      return this.internshipOfferModel.find().exec();
    }
  
    return this.internshipOfferModel.find(searchConditions).exec();
  }
}