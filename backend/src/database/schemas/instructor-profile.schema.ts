import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class InstructorProfileDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  userId: string;

  @Prop({ required: true })
  headline: string;

  @Prop({ required: true })
  biography: string;

  @Prop({ default: 0 })
  totalStudents: number;

  @Prop()
  website?: string;

  @Prop()
  twitter?: string;

  @Prop()
  linkedin?: string;

  @Prop()
  youtube?: string;
}

export const InstructorProfileSchema = SchemaFactory.createForClass(InstructorProfileDocument);
