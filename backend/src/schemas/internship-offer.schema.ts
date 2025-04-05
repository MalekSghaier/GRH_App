// src/schemas/internship-offer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class InternshipOffer extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  duration: number; // Durée en mois

  @Prop({ required: true })
  educationLevel: string;

  @Prop({ required: true })
  requirements: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type InternshipOfferDocument = InternshipOffer & Document<Types.ObjectId>;

export const InternshipOfferSchema = SchemaFactory.createForClass(InternshipOffer);