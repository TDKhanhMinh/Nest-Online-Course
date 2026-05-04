import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'enrollments', timestamps: true })
export class EnrollmentDocument extends Document<string> {
  @Prop({ type: String, required: true })
  declare _id: string;

  @Prop({ type: String, required: true, index: true })
  studentId: string;

  @Prop({ type: String, required: true, index: true })
  courseId: string;

  @Prop({ type: String, default: 'ACTIVE' })
  status: string;

  @Prop({ type: Date, required: true })
  enrolledAt: Date;
}

export const EnrollmentSchema: MongooseSchema = SchemaFactory.createForClass(EnrollmentDocument);

// Compound index để query nhanh theo (studentId + courseId)
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
