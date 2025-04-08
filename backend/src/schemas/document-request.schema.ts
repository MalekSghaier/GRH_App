//document-request.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentRequestDocument = DocumentRequest & Document;

export enum DocumentType {
  EMPLOYMENT_CONTRACT = 'Contrat de travail',
  WORK_CERTIFICATE = 'Attestation de travail',
  PAYSLIPS = 'Bulletins de paie',
  FINAL_BALANCE = 'Solde de tout compte',
  ATTENDANCE_CERTIFICATE = 'Attestation de présence',
  SALARY_ADVANCE = 'Demande d’avance sur salaire',
  RECOMMENDATION_LETTER = 'Lettre de recommandation',
  DUPLICATE_DOCUMENT = 'Duplicata de documents perdus',
}

export enum RequestStatus {
  PENDING = 'En attente',
  IN_PROGRESS = 'En cours de traitement',
  APPROVED = 'Approuvée',
  REJECTED = 'Rejetée',
}

@Schema({ timestamps: true })
export class DocumentRequest {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  jobPosition: string;

  @Prop({ required: true, enum: ['CDI', 'CDD'] })
  contractType: string;

  @Prop({ required: true })
  professionalEmail: string;

  @Prop({ required: true, enum: DocumentType })
  documentType: DocumentType;

  @Prop({ required: true })
  userId: string; 

  @Prop({ required: true, enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;
}

export const DocumentRequestSchema = SchemaFactory.createForClass(DocumentRequest);