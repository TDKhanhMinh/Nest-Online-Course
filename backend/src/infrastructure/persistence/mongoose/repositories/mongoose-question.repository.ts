import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../../../../core/domain/quiz/entities/question.entity';
import { IQuestionRepository } from '../../../../core/domain/quiz/ports/i-question.repository';
import { PageMetaDto } from '../../../../core/shared/pagination/offset/page-meta.dto';
import { PageOptionsDto } from '../../../../core/shared/pagination/offset/page-options.dto';
import { PageDto } from '../../../../core/shared/pagination/offset/page.dto';
import { UniqueId } from '../../../../core/shared/types/unique-id.vo';
import { QuestionDocument } from '../../../../database/schemas/question.schema';
import { QuestionMapper } from '../mappers/question.mapper';

@Injectable()
export class MongooseQuestionRepository implements IQuestionRepository {
  constructor(
    @InjectModel(QuestionDocument.name)
    private readonly model: Model<QuestionDocument>,
    private readonly mapper: QuestionMapper
  ) {}

  async save(question: Question): Promise<void> {
    const data = this.mapper.toPersistence(question);
    await this.model
      .findByIdAndUpdate(data._id, data, { upsert: true, new: true })
      .exec();
  }

  async findById(id: UniqueId): Promise<Question | null> {
    const doc = await this.model.findById(id.value).lean().exec();
    return doc ? this.mapper.toDomain(doc as QuestionDocument) : null;
  }

  async delete(id: UniqueId): Promise<void> {
    await this.model.findByIdAndDelete(id.value).exec();
  }

  async findInstructorQuestions(
    instructorId: UniqueId,
    pageOptionsDto: PageOptionsDto,
    courseId?: UniqueId
  ): Promise<PageDto<Question>> {
    const filter: any = { instructorId: instructorId.value };
    if (courseId) {
      filter.courseId = courseId.value;
    }

    const itemCount = await this.model.countDocuments(filter).exec();
    const entities = await this.model
      .find(filter)
      .sort({ createdAt: pageOptionsDto.order === 'ASC' ? 1 : -1 })
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.limit)
      .lean()
      .exec();

    const questions = entities.map((doc) => this.mapper.toDomain(doc as QuestionDocument));
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(questions, pageMetaDto);
  }
}
