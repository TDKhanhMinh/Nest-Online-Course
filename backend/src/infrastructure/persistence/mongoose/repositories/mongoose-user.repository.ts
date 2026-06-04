import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@domain/user/entities/user.entity';
import { UserDocument } from '@/database/schemas/user.schema';
import { IUserRepository } from '@domain/user/ports/i-user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Role } from '@shared/types/role.enum';


@Injectable()
export class MongooseUserRepository implements IUserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: UniqueId): Promise<User | null> {
    const doc = await this.userModel.findById(id.value).exec();
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }

  async save(user: User): Promise<void> {
    const persistenceData = UserMapper.toPersistence(user);
    await this.userModel
      .findByIdAndUpdate(user.id.value, persistenceData, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async findAll(limit: number, offset: number): Promise<{ users: User[], total: number }> {
    const [docs, total] = await Promise.all([
      this.userModel.find().sort({ createdAt: -1, _id: -1 }).skip(offset).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return {
      users: docs.map(doc => UserMapper.toDomain(doc)),
      total,
    };
  }

  async delete(id: UniqueId): Promise<void> {
    await this.userModel.findByIdAndDelete(id.value).exec();
  }

  async findActiveStudentUserIdsBatch(limit: number, afterId?: string): Promise<string[]> {
    const query: any = {
      isActive: true,
      roles: Role.STUDENT,
    };
    if (afterId) {
      query._id = { $gt: afterId };
    }
    const docs = await this.userModel.find(query, { _id: 1 }).sort({ _id: 1 }).limit(limit).exec();
    return docs.map(doc => doc._id.toString());
  }
}
