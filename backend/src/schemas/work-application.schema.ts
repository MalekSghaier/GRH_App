// work-application.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkApplicationDocument = WorkApplication & Document;

@Schema({ timestamps: true })
export class WorkApplication {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true,match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,3}$/, 'Veuillez fournir un email valide'],}) // Validation email
  email: string;

  @Prop({ required: true })
  birthDate: Date; // Date de naissance

  @Prop({ 
    required: true,
    validate: {
      validator: (v: string) => /^\d{8,10}$/.test(v),
      message: 'Le téléphone doit contenir 8 à 10 chiffres'
    }
  })
  phone: string;

  @Prop({ required: true })
  availability: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  cv: string;

  @Prop({ required: true })
  coverLetter: string;

  @Prop({ 
    required: true,
    enum: ['En cours de traitement', 'Rejeté', 'Approuvé'],
    default: 'En cours de traitement'
  })
  status: string;
}

export const WorkApplicationSchema = SchemaFactory.createForClass(WorkApplication);