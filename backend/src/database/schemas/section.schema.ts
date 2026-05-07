import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class SectionDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'CourseDocument' })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  orderIndex: number;
}

export const SectionSchema = SchemaFactory.createForClass(SectionDocument);



