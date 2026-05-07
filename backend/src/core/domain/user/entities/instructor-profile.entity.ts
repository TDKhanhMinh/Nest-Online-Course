import { Entity } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface InstructorProfileProps {
  userId: UniqueId;
  headline: string;
  biography: string;
  totalStudents: number;
  website?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export class InstructorProfile extends Entity<InstructorProfileProps> {
  get userId(): UniqueId {
    return this.props.userId;
  }
  get headline(): string {
    return this.props.headline;
  }
  get biography(): string {
    return this.props.biography;
  }
  get totalStudents(): number {
    return this.props.totalStudents;
  }
  get website(): string | undefined {
    return this.props.website;
  }
  get twitter(): string | undefined {
    return this.props.twitter;
  }
  get linkedin(): string | undefined {
    return this.props.linkedin;
  }
  get youtube(): string | undefined {
    return this.props.youtube;
  }

  public static create(
    props: Omit<InstructorProfileProps, 'totalStudents'>,
    id?: string,
  ): InstructorProfile {
    return new InstructorProfile(
      { ...props, totalStudents: 0 },
      id ? new UniqueId(id) : UniqueId.generate(),
    );
  }

  public static reconstitute(
    props: InstructorProfileProps,
    id: UniqueId,
  ): InstructorProfile {
    return new InstructorProfile(props, id);
  }
}



