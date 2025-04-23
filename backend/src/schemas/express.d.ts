//express.d.ts
import { UserPayload } from './user-payload'; 

declare module 'express' {
  interface Request {
    user?: UserPayload; // `user` est optionnel
  }

  export interface RequestWithUser extends Request {
    user: {
      email: string;
      _id: string;
      role: string;
      // Ajoutez ici d'autres propriétés que vous stockez dans le JWT
    };
  }
}