import { Schema, Document, model } from 'mongoose';

export interface IConge extends Document {
  userId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
}

export const CongeSchema = new Schema<IConge>({
  userId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestDate: { type: Date, default: Date.now } 
});

export const Conge = model<IConge>('Conge', CongeSchema);
