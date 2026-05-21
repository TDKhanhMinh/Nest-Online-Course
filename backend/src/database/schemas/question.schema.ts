import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { QuestionType } from '../../core/shared/types/question-type.enum';
import { DifficultyLevel } from '../../core/shared/types/difficulty-level.enum';

@Schema({ _id: false })
export class QuestionOptionDocument {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: false })
  isCorrect: boolean;

  @Prop()
  explanation?: string;
}
export const QuestionOptionSchema = SchemaFactory.createForClass(QuestionOptionDocument);

@Schema({ timestamps: true, collection: 'questions' })
export class QuestionDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  instructorId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseDocument' })
  courseId?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: String, enum: QuestionType })
  type: QuestionType;

  @Prop({ required: true, type: String, enum: DifficultyLevel })
  difficulty: DifficultyLevel;

  @Prop({ type: [QuestionOptionSchema], default: [] })
  options: QuestionOptionDocument[];

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionDocument);
QuestionSchema.index({ instructorId: 1, tags: 1 });
