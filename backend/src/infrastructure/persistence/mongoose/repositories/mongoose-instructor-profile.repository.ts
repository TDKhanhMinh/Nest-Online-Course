import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstructorProfile } from '@domain/user/entities/instructor-profile.entity';
import { InstructorProfileDocument } from '@/database/schemas/instructor-profile.schema';
import { IInstructorProfileRepository } from '@domain/user/ports/i-instructor-profile.repository';
import { InstructorProfileMapper } from '../mappers/instructor-profile.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class MongooseInstructorProfileRepository implements IInstructorProfileRepository {
  constructor(
    @InjectModel(InstructorProfileDocument.name)
    private readonly instructorProfileModel: Model<InstructorProfileDocument>,
  ) {}

  async findByUserId(userId: UniqueId): Promise<InstructorProfile | null> {
    const doc = await this.instructorProfileModel.findOne({ userId: userId.value }).exec();
    if (!doc) return null;
    return InstructorProfileMapper.toDomain(doc);
  }

  async save(profile: InstructorProfile): Promise<void> {
    const persistenceData = InstructorProfileMapper.toPersistence(profile);
    await this.instructorProfileModel
      .findByIdAndUpdate(profile.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }
}
