import { AggregateRoot } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { Role } from '@/common/types/role.enum';

export interface UserProps {
  email: string;
  passwordHash: string;
  role: Role;
}

export class User extends AggregateRoot<UserProps> {
  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): Role {
    return this.props.role;
  }

  public static create(props: UserProps, id?: string): User {
    return new User(props, id ? new UniqueId(id) : UniqueId.generate());
  }
}
