import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizAttempt } from '../../../../core/domain/quiz/entities/quiz-attempt.entity';
import { IQuizAttemptRepository } from '../../../../core/domain/quiz/ports/i-quiz-attempt.repository';
import { PageMetaDto } from '../../../../core/shared/pagination/offset/page-meta.dto';
import { PageOptionsDto } from '../../../../core/shared/pagination/offset/page-options.dto';
import { PageDto } from '../../../../core/shared/pagination/offset/page.dto';
import { UniqueId } from '../../../../core/shared/types/unique-id.vo';
import { QuizAttemptDocument } from '../../../../database/schemas/quiz-attempt.schema';
import { QuizAttemptMapper } from '../mappers/quiz-attempt.mapper';

@Injectable()
export class MongooseQuizAttemptRepository implements IQuizAttemptRepository {
  constructor(
    @InjectModel(QuizAttemptDocument.name)
    private readonly model: Model<QuizAttemptDocument>,
    private readonly mapper: QuizAttemptMapper
  ) {}

  async save(attempt: QuizAttempt): Promise<void> {
    const data = this.mapper.toPersistence(attempt);
    await this.model
      .findByIdAndUpdate(data._id, data, { upsert: true, new: true })
      .exec();
  }

  async findById(id: UniqueId): Promise<QuizAttempt | null> {
    const doc = await this.model.findById(id.value).lean().exec();
    return doc ? this.mapper.toDomain(doc as QuizAttemptDocument) : null;
  }

  async findByStudentAndQuiz(
    studentId: UniqueId,
    quizId: UniqueId,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<QuizAttempt>> {
    const filter = { studentId: studentId.value, quizId: quizId.value };

    const itemCount = await this.model.countDocuments(filter).exec();
    const entities = await this.model
      .find(filter)
      .sort({ createdAt: pageOptionsDto.order === 'ASC' ? 1 : -1 })
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit)
      .lean()
      .exec();

    const attempts = entities.map((doc) => this.mapper.toDomain(doc as QuizAttemptDocument));
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(attempts, pageMetaDto);
  }

  async countAttempts(studentId: UniqueId, quizId: UniqueId): Promise<number> {
    return this.model.countDocuments({ studentId: studentId.value, quizId: quizId.value }).exec();
  }
}
