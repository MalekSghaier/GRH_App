// src/app/models/document-request.model.ts
export interface DocumentRequest {
    _id: string; 
    fullName: string; 
    jobPosition: string; 
    contractType: string; 
    professionalEmail: string; 
    documentType: string; 
    userId: string; 
    status: string; 
    createdAt: Date; 
    updatedAt: Date; 
  }