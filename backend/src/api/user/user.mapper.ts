import { User } from './entities/user.entity';
import { UserDocument } from '@/database/schemas/user.schema';
import { UniqueId } from '@/common/types/unique-id.vo';

export class UserMapper {
  static toDomain(doc: UserDocument): User {
    return User.create(
      {
        fullName: doc.fullName,
        email: doc.email,
        passwordHash: doc.passwordHash,
        roles: doc.roles,
        courseIds: doc.courseIds?.map(id => new UniqueId(id)) ?? [],
      },
      (doc._id as any).toString(),
    );
  }

  static toPersistence(user: User): any {
    return {
      _id: user.id.value as any,
      fullName: user.fullName,
      email: user.email,
      passwordHash: user.passwordHash,
      roles: user.roles,
      courseIds: user.courseIds.map(id => id.value),
    };
  }
}
