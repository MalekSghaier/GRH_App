//user-payload.ts
export interface UserPayload {
    id: string;  // L'ID vient du JWT et est souvent une string
    sub: string;  // Standard JWT field for subject (user ID)
    email: string;
    name: string; 
    role: string;
    companyName: string;

  }
  