import { Schema, Document, model } from 'mongoose';

export interface Pointage extends Document {
  userId: string;
  date: string; // format YYYY-MM-DD
  entree: string; // format HH:mm:ss
  sortie?: string; // optionnel, si pas encore de sortie
}

const PointageSchema = new Schema<Pointage>({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // Ex: 2024-04-23
  entree: { type: String, required: true },
  sortie: { type: String }
});

export const PointageModel = model<Pointage>('Pointage', PointageSchema);
