import { Injectable } from '@nestjs/common';
import { QuizAttempt } from '../../../../core/domain/quiz/entities/quiz-attempt.entity';
import { QuizAttemptDocument, StudentAnswerDocument } from '../../../../database/schemas/quiz-attempt.schema';
import { UniqueId } from '../../../../core/shared/types/unique-id.vo';

@Injectable()
export class QuizAttemptMapper {
  toDomain(doc: QuizAttemptDocument): QuizAttempt {
    return QuizAttempt.reconstitute(
      {
        studentId: new UniqueId(doc.studentId.toString()),
        quizId: new UniqueId(doc.quizId.toString()),
        startTime: doc.startTime,
        endTime: doc.endTime,
        score: doc.score,
        isPassed: doc.isPassed,
        answers: doc.answers.map((a: StudentAnswerDocument) => ({
          questionId: new UniqueId(a.questionId.toString()),
          selectedOptionIds: a.selectedOptionIds.map((id) => new UniqueId(id.toString())),
        })),
      },
      new UniqueId((doc._id as any).toString())
    );
  }

  toPersistence(domain: QuizAttempt): any {
    return {
      _id: domain.id.value,
      studentId: domain.studentId.value,
      quizId: domain.quizId.value,
      startTime: domain.startTime,
      endTime: domain.endTime,
      score: domain.score,
      isPassed: domain.isPassed,
      answers: domain.answers.map((a) => ({
        questionId: a.questionId.value,
        selectedOptionIds: a.selectedOptionIds.map((id) => id.value),
      })),
    };
  }
}
