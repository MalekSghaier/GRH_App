// user.schema.ts
import { Schema, Document, model, CallbackError } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  EMPLOYEE = 'employé',
  INTERN = 'stagiaire',
  VISITOR = 'visiteur',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string; 
  soldeConges: number; 
  profileImageId?: string;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,3}$/, 'Veuillez fournir un email valide'],
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.VISITOR,
  },
  company: { type: String }, // Société d'accueil (optionnelle)
  soldeConges: { 
    type: Number, 
    default: 0,
    min: 0 // Empêche les valeurs négatives
  },
  profileImageId: { type: String },
}, { collection: 'users' });

UserSchema.pre<IUser>('save', async function (next: (err?: CallbackError) => void) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error(String(error)));
  }
});

UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', UserSchema);

export type UserDocument = IUser;