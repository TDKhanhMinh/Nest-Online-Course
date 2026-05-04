import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

/**
 * LessonSubDocument – nhúng trực tiếp vào CourseDocument.
 * MongoDB: Lessons là sub-document của Course (1 aggregate = 1 collection).
 */
@Schema({ _id: false })
export class LessonSubDocument {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  videoAssetId: string;

  @Prop({ required: true })
  order: number;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: Number, default: 0 })
  lastScore: number;
}

export const LessonSubSchema: MongooseSchema = SchemaFactory.createForClass(LessonSubDocument);

@Schema({ collection: 'courses', timestamps: true })
export class CourseDocument extends Document<string> {
  @Prop({ type: String, required: true })
  declare _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, required: true })
  instructorId: string;

  @Prop({ type: Number, default: 70 })
  minPassScore: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: [LessonSubSchema], default: [] })
  lessons: LessonSubDocument[];
}

export const CourseSchema: MongooseSchema = SchemaFactory.createForClass(CourseDocument);
