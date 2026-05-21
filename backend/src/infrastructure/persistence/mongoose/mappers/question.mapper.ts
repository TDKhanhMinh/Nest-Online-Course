import { Injectable } from '@nestjs/common';
import { Question, QuestionProps } from '../../../../core/domain/quiz/entities/question.entity';
import { QuestionDocument, QuestionOptionDocument } from '../../../../database/schemas/question.schema';
import { UniqueId } from '../../../../core/shared/types/unique-id.vo';
import { QuestionOption } from '../../../../core/domain/quiz/value-objects/question-option.vo';

@Injectable()
export class QuestionMapper {
  toDomain(doc: QuestionDocument): Question {
    return Question.reconstitute(
      {
        instructorId: new UniqueId(doc.instructorId.toString()),
        courseId: doc.courseId ? new UniqueId(doc.courseId.toString()) : undefined,
        title: doc.title,
        content: doc.content,
        type: doc.type,
        difficulty: doc.difficulty,
        tags: doc.tags,
        options: doc.options.map((opt: QuestionOptionDocument) =>
          QuestionOption.reconstitute({
            id: new UniqueId(opt.id),
            content: opt.content,
            isCorrect: opt.isCorrect,
            explanation: opt.explanation,
          })
        ),
      },
      new UniqueId((doc._id as any).toString())
    );
  }

  toPersistence(domain: Question): any {
    return {
      _id: domain.id.value,
      instructorId: domain.instructorId.value,
      courseId: domain.courseId?.value,
      title: domain.title,
      content: domain.content,
      type: domain.type,
      difficulty: domain.difficulty,
      tags: domain.tags,
      options: domain.options.map((opt) => ({
        id: opt.id.value,
        content: opt.content,
        isCorrect: opt.isCorrect,
        explanation: opt.explanation,
      })),
    };
  }
}
