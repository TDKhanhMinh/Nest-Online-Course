export class CourseTitle {
  readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length < 3) {
      throw new Error('CourseTitle must be at least 3 characters');
    }
    if (value.length > 200) {
      throw new Error('CourseTitle must be at most 200 characters');
    }
    this.value = value.trim();
  }

  equals(other: CourseTitle): boolean {
    return this.value === other.value;
  }
}



