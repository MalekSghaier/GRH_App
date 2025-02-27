//internship-application.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InternshipApplicationDocument = InternshipApplication & Document;

@Schema({ timestamps: true })
export class InternshipApplication {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  establishment: string;

  @Prop({ required: true })
  field: string;

  @Prop({ required: true })
  studyLevel: string;

  @Prop({ required: true })
  period: string;

  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  cv: string; 

  @Prop({ required: true })
  coverLetter: string; 
}

export const InternshipApplicationSchema = SchemaFactory.createForClass(InternshipApplication);
