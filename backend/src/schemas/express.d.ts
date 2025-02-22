//express.d.ts
import { UserPayload } from './user-payload'; // Assurez-vous que le chemin est correct

declare module 'express' {
  interface Request {
    user?: UserPayload; // `user` est optionnel
  }
}