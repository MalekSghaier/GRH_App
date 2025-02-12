//Définit le modèle MongoDB d'un utilisateur avec Mongoose
import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: false },
});

export interface User extends Document {
  name: string;
  email: string;
  age?: number;
}

// Ajoutez une classe pour représenter le modèle
export class UserModel {
  name: string;
  email: string;
  age?: number;
}
