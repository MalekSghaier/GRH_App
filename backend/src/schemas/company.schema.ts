import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ 
    required: true, 
    match: [/^\d{8,10}$/, 'Le numéro de téléphone doit contenir entre 8 et 10 chiffres.'] 
  })
  phone: string;

  @Prop({ required: true, unique: true })
  taxId: string; // Immatricule fiscale
  
  @Prop()
  logo: string; // URL de l'image (PNG, JPG, JPEG)

  @Prop()
  signature: string; // URL de l'image ou PDF (PNG, JPG, JPEG, PDF)
}

export const CompanySchema = SchemaFactory.createForClass(Company);
