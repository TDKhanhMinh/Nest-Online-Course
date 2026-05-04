import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CertificateDocument extends Document {
  @Prop({ type: String, required: true, index: true })
  studentId: string;

  @Prop({ type: String, required: true, index: true })
  courseId: string;

  @Prop({ type: String, required: true, unique: true })
  certificateNumber: string;

  @Prop({ required: true })
  certificateUrl: string;

  @Prop({ type: Date, required: true })
  issuedAt: Date;
}

export const CertificateSchema: MongooseSchema = SchemaFactory.createForClass(CertificateDocument);

// Compound index ngăn cấp chứng chỉ trùng
CertificateSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
