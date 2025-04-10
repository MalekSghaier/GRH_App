// src/app/models/conges-request.model.ts
export interface CongesRequest {
    _id: string; 
    userId: string; 
    startDate: Date; 
    endDate: Date; 
    reason: string; 
    status: string; 
    requestDate: Date; 
  }