import { Schema, Document } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  EMPLOYEE = 'employé',
  INTERN = 'stagiaire',
  VISITOR = 'visiteur',
}

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true, // Assure que l'email est unique
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,3}$/, 'Veuillez fournir un email valide'], // Validation du format de l'email
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.VISITOR,
  },
});

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class UserModel {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
