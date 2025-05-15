// src/schemas/pointage.schema.ts
import { Schema, Document, model ,Types } from 'mongoose';

export enum PointageSource {
  QR = 'qr',
  FACE = 'face'
}
export class Pointage extends Document {
  userId: Types.ObjectId; 
  date: string;
  entree: string;
  sortie?: string;
  source: PointageSource;
}

export const PointageSchema = new Schema<Pointage>({
  userId: { 
  type: Schema.Types.ObjectId, 
  ref: 'User', 
  required: true 
  },
  date: { type: String, required: true },
  entree: { type: String, required: true },
  sortie: { type: String },
  source: { type: String, enum: Object.values(PointageSource),required: true }
});

export type PointageDocument = Pointage & Document;
export const PointageModel = model<PointageDocument>('Pointage', PointageSchema);
