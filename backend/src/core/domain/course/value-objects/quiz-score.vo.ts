export class QuizScore {
  readonly value: number;

  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('QuizScore must be between 0 and 100');
    }
    this.value = value;
  }

  isGreaterOrEqual(other: QuizScore): boolean {
    return this.value >= other.value;
  }

  equals(other: QuizScore): boolean {
    return this.value === other.value;
  }
}



