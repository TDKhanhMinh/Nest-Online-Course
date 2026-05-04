import { User } from './entities/user.entity';
import { UserDocument } from '@/database/schemas/user.schema';

export class UserMapper {
  static toDomain(doc: UserDocument): User {
    return User.create(
      {
        email: doc.email,
        passwordHash: doc.passwordHash,
        role: doc.role,
      },
      doc._id,
    );
  }

  static toPersistence(user: User): any {
    return {
      _id: user.id.value,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
    };
  }
}
