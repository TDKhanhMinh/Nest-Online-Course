import { Types } from 'mongoose';

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
    return new UniqueId(new Types.ObjectId().toHexString());
  }
}
