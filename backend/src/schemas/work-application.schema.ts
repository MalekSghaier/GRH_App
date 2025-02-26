//work-application.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkApplicationDocument = WorkApplication & Document;

@Schema({ timestamps: true })
export class WorkApplication {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  experience: string; // Années d'expérience

  @Prop({ required: true })
  education: string; // Niveau d'études et diplôme

  @Prop({ required: true })
  position: string; // Poste souhaité

  @Prop({ required: true })
  contractType: string; // Type de contrat (CDI, CDD, etc.)

  @Prop({ required: true })
  availability: string; // Disponibilité

  @Prop({ required: true })
  salaryExpectation: string; // Salaire souhaité

  @Prop({ required: true })
  company: string; // Entreprise ciblée

  @Prop({ required: true })
  cv: string; // Nom du fichier CV

  @Prop({ required: true })
  coverLetter: string; // Nom du fichier lettre de motivation
}

export const WorkApplicationSchema = SchemaFactory.createForClass(WorkApplication);
