import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CourseLevel } from '@shared/types/course-level.enum';
import { CourseStatus } from '@shared/types/course-status.enum';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CourseDocument extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.Decimal128, required: true, default: 0.0 })
  price: Types.Decimal128;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ type: String, enum: CourseLevel, default: CourseLevel.BEGINNER })
  level: CourseLevel;

  @Prop({ default: 'Vietnamese' })
  language: string;

  @Prop({ type: String, enum: CourseStatus, default: CourseStatus.DRAFT })
  status: CourseStatus;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  instructorId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'CategoryDocument' })
  categoryId: string;

  @Prop({ default: 0 })
  totalEnrolled: number;

  @Prop({ default: 0 })
  totalReview: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: 0 })
  totalView: number;

  @Prop({ default: 0 })
  totalLike: number;

  @Prop({ default: 0 })
  totalContent: number;

  @Prop({ default: 0 })
  totalSection: number;

  @Prop({ default: 0 })
  totalLesson: number;

  @Prop({ default: 0 })
  totalQuiz: number;

  @Prop({ default: 0 })
  totalAssignment: number;

  @Prop({ default: 0 })
  totalLecture: number;

  createdAt: Date;
  
  updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(CourseDocument);



