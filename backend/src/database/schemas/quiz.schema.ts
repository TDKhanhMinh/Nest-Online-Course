import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class QuizQuestionConfigDocument {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'QuestionDocument' })
  questionId: string;

  @Prop({ required: true, default: 1 })
  points: number;

  @Prop({ required: true, default: 0 })
  orderIndex: number;
}
export const QuizQuestionConfigSchema = SchemaFactory.createForClass(QuizQuestionConfigDocument);

@Schema({ timestamps: true, collection: 'quizzes' })
export class QuizDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  instructorId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'LessonDocument' })
  lessonId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, default: 80 })
  passingScore: number;

  @Prop({ required: true, default: 0 })
  timeLimit: number; // minutes

  @Prop({ required: true, default: 0 })
  maxAttempts: number;

  @Prop({ type: [QuizQuestionConfigSchema], default: [] })
  questions: QuizQuestionConfigDocument[];
}

export const QuizSchema = SchemaFactory.createForClass(QuizDocument);
QuizSchema.index({ lessonId: 1 }, { unique: true }); // One quiz per lesson for now
