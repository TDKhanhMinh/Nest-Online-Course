import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstructorProfileDocument } from '@/database/schemas/instructor-profile.schema';
import { InstructorProfile } from '@/api/user/entities/instructor-profile.entity';
import { IInstructorProfileRepository } from '@/common/abstractions/repositories/i-instructor-profile.repository';
import { InstructorProfileMapper } from '@/api/user/instructor-profile.mapper';

@Injectable()
export class InstructorProfileRepository implements IInstructorProfileRepository {
  constructor(
    @InjectModel(InstructorProfileDocument.name) private readonly model: Model<InstructorProfileDocument>,
    private readonly mapper: InstructorProfileMapper,
  ) {}

  async findByUserId(userId: string): Promise<InstructorProfile | null> {
    const doc = await this.model.findOne({ userId }).exec();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async save(profile: InstructorProfile): Promise<void> {
    const persistence = this.mapper.toPersistence(profile);
    await this.model.findByIdAndUpdate(persistence._id, persistence, { upsert: true }).exec();
  }
}
