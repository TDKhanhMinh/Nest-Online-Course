import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IQuizRepository, QUIZ_REPOSITORY } from '../../../domain/quiz/ports/i-quiz.repository';
import { IQuizAttemptRepository, QUIZ_ATTEMPT_REPOSITORY } from '../../../domain/quiz/ports/i-quiz-attempt.repository';
import { IQuestionRepository, QUESTION_REPOSITORY } from '../../../domain/quiz/ports/i-question.repository';
import { UniqueId } from '../../../shared/types/unique-id.vo';
import { QuizAttempt } from '../../../domain/quiz/entities/quiz-attempt.entity';
import { QuizPassedEvent } from '../../../domain/quiz/events/quiz-passed.event';

export interface SubmitQuizAttemptCommand {
  studentId: string;
  attemptId: string;
  answers: {
    questionId: string;
    selectedOptionIds: string[];
  }[];
}

@Injectable()
export class SubmitQuizAttemptUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(QUIZ_ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IQuizAttemptRepository,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(command: SubmitQuizAttemptCommand): Promise<QuizAttempt> {
    const studentId = new UniqueId(command.studentId);
    const attemptId = new UniqueId(command.attemptId);

    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    if (!attempt.studentId.equals(studentId)) {
      throw new BadRequestException('You do not own this attempt');
    }

    if (attempt.isCompleted()) {
      throw new BadRequestException('This attempt is already submitted');
    }

    const quiz = await this.quizRepository.findById(attempt.quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // 1. Record answers
    for (const ans of command.answers) {
      attempt.recordAnswer(
        new UniqueId(ans.questionId),
        ans.selectedOptionIds.map((id) => new UniqueId(id))
      );
    }

    // 2. Calculate score
    let totalScore = 0;
    let maxPossibleScore = 0;

    for (const qConfig of quiz.questions) {
      maxPossibleScore += qConfig.points;

      const studentAns = attempt.answers.find((a) => a.questionId.equals(qConfig.questionId));
      if (!studentAns) continue; // Student didn't answer this question

      const question = await this.questionRepository.findById(qConfig.questionId);
      if (!question) continue;

      const correctOptionIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id.value);
        
      const selectedIds = studentAns.selectedOptionIds.map(id => id.value);

      // Check if exact match
      if (
        correctOptionIds.length === selectedIds.length &&
        correctOptionIds.every((id) => selectedIds.includes(id))
      ) {
        totalScore += qConfig.points;
      }
    }

    // Convert score to percentage
    const finalScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    const isPassed = finalScore >= quiz.passingScore;

    // 3. Submit attempt
    attempt.submit(finalScore, isPassed);
    await this.attemptRepository.save(attempt);

    // 4. Dispatch event if passed
    if (isPassed) {
      this.eventEmitter.emit(
        'quiz.passed',
        new QuizPassedEvent({
          studentId: attempt.studentId,
          quizId: attempt.quizId,
          score: finalScore,
          passingScore: quiz.passingScore,
        })
      );
    }

    return attempt;
  }
}
