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
}