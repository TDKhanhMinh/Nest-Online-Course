import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { CourseStatus } from '@/common/types/course-status.enum';
import { CourseLevel } from '@/common/types/course-level.enum';

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
}

export const CourseSchema = SchemaFactory.createForClass(CourseDocument);
