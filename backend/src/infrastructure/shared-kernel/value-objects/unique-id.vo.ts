import { v4 as uuidv4 } from 'uuid';

export class UniqueId {
  readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UniqueId cannot be empty');
    }
    this.value = value;
  }

  equals(other: UniqueId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static generate(): UniqueId {
    return new UniqueId(uuidv4());
  }
}
