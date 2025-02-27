import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';  

@Schema()
export class DocumentEntity extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })  
  uploadedBy: MongooseSchema.Types.ObjectId;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
export type DocumentDocument = DocumentEntity & Document;
export { DocumentEntity as Document };
