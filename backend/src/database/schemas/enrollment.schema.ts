import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class EnrollmentDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  studentId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'CourseDocument' })
  courseId: string;

  @Prop({ type: Types.Decimal128, default: 0.0 })
  progress: Types.Decimal128;

  @Prop({ type: String, default: 'ACTIVE' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  enrolledAt: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(EnrollmentDocument);

EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
