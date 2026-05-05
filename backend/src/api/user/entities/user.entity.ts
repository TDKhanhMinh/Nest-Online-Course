import { AggregateRoot } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { Role } from '@/common/types/role.enum';
import { InstructorProfile } from './instructor-profile.entity';

export interface UserProps {
  fullName: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  instructorProfile?: InstructorProfile;
  courseIds: UniqueId[];
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

  get roles(): Role[] {
    return this.props.roles;
  }

  get instructorProfile(): InstructorProfile | undefined {
    return this.props.instructorProfile;
  }

  get courseIds(): UniqueId[] {
    return this.props.courseIds;
  }

  get isInstructor(): boolean {
    return this.props.roles.includes(Role.INSTRUCTOR);
  }

  addCourse(courseId: UniqueId): void {
    if (!this.isInstructor) {
      throw new Error('Only instructors can have courses');
    }
    if (!this.props.courseIds.some((id) => id.equals(courseId))) {
      this.props.courseIds.push(courseId);
    }
  }

  updateEmail(email: string): void {
    this.props.email = email;
  }

  updateRoles(roles: Role[]): void {
    this.props.roles = roles;
  }

  public static create(
    props: Omit<UserProps, 'courseIds'> & { courseIds?: UniqueId[] },
    id?: string,
  ): User {
    return new User(
      { ...props, courseIds: props.courseIds ?? [] },
      id ? new UniqueId(id) : UniqueId.generate(),
    );
  }

  public static reconstitute(props: UserProps, id: string): User {
    return new User(props, new UniqueId(id));
  }
}
