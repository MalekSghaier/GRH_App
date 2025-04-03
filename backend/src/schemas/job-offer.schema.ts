import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class JobOffer extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  experienceRequired: number;

  @Prop({ required: true })
  educationLevel: string;

  @Prop({ required: true })
  jobRequirements: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  createdBy: Types.ObjectId;


  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type JobOfferDocument = JobOffer & Document<Types.ObjectId>;

export const JobOfferSchema = SchemaFactory.createForClass(JobOffer);