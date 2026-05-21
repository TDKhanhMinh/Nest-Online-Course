import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IQuizRepository } from '../../../../core/domain/quiz/ports/i-quiz.repository';
import { Quiz } from '../../../../core/domain/quiz/entities/quiz.entity';
import { QuizDocument } from '../../../../database/schemas/quiz.schema';
import { QuizMapper } from '../mappers/quiz.mapper';
import { UniqueId } from '../../../../core/shared/types/unique-id.vo';

@Injectable()
export class MongooseQuizRepository implements IQuizRepository {
  constructor(
    @InjectModel(QuizDocument.name)
    private readonly model: Model<QuizDocument>,
    private readonly mapper: QuizMapper
  ) {}

  async save(quiz: Quiz): Promise<void> {
    const data = this.mapper.toPersistence(quiz);
    await this.model
      .findByIdAndUpdate(data._id, data, { upsert: true, new: true })
      .exec();
  }

  async findById(id: UniqueId): Promise<Quiz | null> {
    const doc = await this.model.findById(id.value).lean().exec();
    return doc ? this.mapper.toDomain(doc as QuizDocument) : null;
  }

  async findByLessonId(lessonId: UniqueId): Promise<Quiz | null> {
    const doc = await this.model.findOne({ lessonId: lessonId.value }).lean().exec();
    return doc ? this.mapper.toDomain(doc as QuizDocument) : null;
  }

  async delete(id: UniqueId): Promise<void> {
    await this.model.findByIdAndDelete(id.value).exec();
  }
}
