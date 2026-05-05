import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

@Schema({ timestamps: true })
export class CourseDocument extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, required: true })
  instructorId: string;

  @Prop({ required: true, type: Number })
  priceTier: number;

  @Prop({ type: String, enum: CourseStatus, default: CourseStatus.DRAFT })
  status: CourseStatus;

  @Prop({ type: Number, default: 70 })
  minPassScore: number;

  @Prop({ default: false })
  isPublished: boolean;
}

export const CourseSchema: MongooseSchema = SchemaFactory.createForClass(CourseDocument);
