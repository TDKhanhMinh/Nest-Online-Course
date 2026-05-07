import { AggregateRoot } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Role } from '@shared/types/role.enum';

export interface UserProps {
  fullName: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  bio?: string;
  roles: Role[];
  isActive: boolean;
}

export class User extends AggregateRoot<UserProps> {
  get fullName(): string {
    return this.props.fullName;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  get roles(): Role[] {
    return this.props.roles;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isInstructor(): boolean {
    return this.props.roles.includes(Role.INSTRUCTOR);
  }

  updateBio(bio: string): void {
    this.props.bio = bio;
  }

  updateAvatar(avatarUrl: string): void {
    this.props.avatarUrl = avatarUrl;
  }

  updateFullName(fullName: string): void {
    this.props.fullName = fullName;
  }

  updateEmail(email: string): void {
    this.props.email = email;
  }

  updateRoles(roles: Role[]): void {
    this.props.roles = roles;
  }

  public static create(
    props: Omit<UserProps, 'isActive'> & { isActive?: boolean },
    id?: UniqueId,
  ): User {
    return new User(
      { ...props, isActive: props.isActive ?? true },
      id ?? UniqueId.generate(),
    );
  }

  public static reconstitute(props: UserProps, id: UniqueId): User {
    return new User(props, id);
  }
}



