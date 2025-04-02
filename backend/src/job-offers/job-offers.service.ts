import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  }): Promise<JobOfferDocument> {
    const createdOffer = new this.jobOfferModel(offerData);
    return createdOffer.save();
  }

  async findAll(): Promise<JobOfferDocument[]> {
    return this.jobOfferModel.find().exec();
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
    }>
  ): Promise<JobOfferDocument | null> {
    return this.jobOfferModel
      .findByIdAndUpdate(id, offerData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<JobOfferDocument | null> {
    return this.jobOfferModel.findByIdAndDelete(id).exec();
  }
}