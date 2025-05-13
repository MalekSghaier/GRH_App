// company.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, CallbackError } from 'mongoose'; // Ajouter Document et CallbackError
import * as bcrypt from 'bcrypt';

// Définir une interface pour les méthodes de Mongoose
export interface CompanyMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Définir le type CompanyDocument qui combine Company, Document et CompanyMethods
export type CompanyDocument = Company & Document & CompanyMethods;

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
  taxId: string;
  
  @Prop()
  logo: string;

  @Prop()
  signature: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: Date.now })
  createdAt: Date;


  // Ajouter le champ _id explicitement (optionnel, car Mongoose l'ajoute automatiquement)
  _id?: string;
}

// Créer le schéma
export const CompanySchema = SchemaFactory.createForClass(Company);

// Ajouter la méthode comparePassword au schéma
CompanySchema.methods.comparePassword = async function (
  this: CompanyDocument,
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware pour hacher le mot de passe avant de sauvegarder
CompanySchema.pre<CompanyDocument>('save', async function (next: (err?: CallbackError) => void) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as CallbackError); // Typer explicitement l'erreur
  }
});