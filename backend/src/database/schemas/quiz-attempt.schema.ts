import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class StudentAnswerDocument {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'QuestionDocument' })
  questionId: string;

  @Prop({ type: [{ type: String }], default: [] })
  selectedOptionIds: string[];
}
export const StudentAnswerSchema = SchemaFactory.createForClass(StudentAnswerDocument);

@Schema({ timestamps: true, collection: 'quiz_attempts' })
export class QuizAttemptDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserDocument' })
  studentId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'QuizDocument' })
  quizId: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop()
  endTime?: Date;

  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ required: true, default: false })
  isPassed: boolean;

  @Prop({ type: [StudentAnswerSchema], default: [] })
  answers: StudentAnswerDocument[];
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttemptDocument);
QuizAttemptSchema.index({ studentId: 1, quizId: 1 });
