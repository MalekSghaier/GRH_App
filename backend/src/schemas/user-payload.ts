//user-payload.ts
export interface UserPayload {
    id: string;  // L'ID vient du JWT et est souvent une string
    email: string;
    name: string; 
    role: string;
  }
  