import { Injectable } from '@nestjs/common';
import { Quiz } from '../../../../core/domain/quiz/entities/quiz.entity';
import { QuizDocument, QuizQuestionConfigDocument } from '../../../../database/schemas/quiz.schema';
import { UniqueId } from '../../../../core/shared/types/unique-id.vo';

@Injectable()
export class QuizMapper {
  toDomain(doc: QuizDocument): Quiz {
    return Quiz.reconstitute(
      {
        instructorId: new UniqueId(doc.instructorId.toString()),
        lessonId: doc.lessonId ? new UniqueId(doc.lessonId.toString()) : null,
        title: doc.title,
        description: doc.description,
        passingScore: doc.passingScore,
        timeLimit: doc.timeLimit,
        maxAttempts: doc.maxAttempts,
        questions: doc.questions.map((q: QuizQuestionConfigDocument) => ({
          questionId: new UniqueId(q.questionId.toString()),
          points: q.points,
          orderIndex: q.orderIndex,
        })),
      },
      new UniqueId((doc._id as any).toString())
    );
  }

  toPersistence(domain: Quiz): any {
    return {
      _id: domain.id.value,
      instructorId: domain.instructorId.value,
      lessonId: domain.lessonId?.value ?? null,
      title: domain.title,
      description: domain.description,
      passingScore: domain.passingScore,
      timeLimit: domain.timeLimit,
      maxAttempts: domain.maxAttempts,
      questions: domain.questions.map((q) => ({
        questionId: q.questionId.value,
        points: q.points,
        orderIndex: q.orderIndex,
      })),
    };
  }
}
