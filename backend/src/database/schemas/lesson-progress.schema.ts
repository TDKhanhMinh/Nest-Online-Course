import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class LessonProgressDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'EnrollmentDocument' })
  enrollmentId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'LessonDocument' })
  lessonId: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: Date, default: null })
  completedAt?: Date;

  @Prop({ type: Date, default: Date.now })
  lastAccessedAt: Date;
}

export const LessonProgressSchema = SchemaFactory.createForClass(LessonProgressDocument);

LessonProgressSchema.index({ enrollmentId: 1, lessonId: 1 }, { unique: true });



