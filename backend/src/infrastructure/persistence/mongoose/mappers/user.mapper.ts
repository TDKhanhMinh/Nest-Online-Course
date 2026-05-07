import { User } from '@domain/user/entities/user.entity';
import { UserDocument } from '@/database/schemas/user.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class UserMapper {
  static toDomain(doc: UserDocument): User {
    return User.reconstitute(
      {
        fullName: doc.fullName,
        email: doc.email,
        passwordHash: doc.passwordHash,
        avatarUrl: doc.avatarUrl,
        bio: doc.bio,
        roles: doc.roles as any,
        isActive: doc.isActive,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(user: User): any {
    return {
      _id: user.id.value,
      fullName: user.fullName,
      email: user.email,
      passwordHash: user.passwordHash,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      roles: user.roles,
      isActive: user.isActive,
    };
  }
}
