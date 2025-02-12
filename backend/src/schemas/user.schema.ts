// Définit le modèle MongoDB d'un utilisateur avec Mongoose
import { Schema, Document } from 'mongoose';

// Enum pour les rôles possibles
export enum UserRole {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  EMPLOYEE = 'employé',
  INTERN = 'stagiaire',
  VISITOR = 'visiteur',
}

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.VISITOR,
  }, // Valeur par défaut : visiteur
});

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole; // Utilisez l'enum pour le type
}

// Ajoutez une classe pour représenter le modèle
export class UserModel {
  name: string;
  email: string;
  password: string;
  role: UserRole; // Utilisez l'enum pour le type
}
