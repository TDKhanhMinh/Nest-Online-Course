import { InstructorProfile } from '@domain/user/entities/instructor-profile.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const IINSTRUCTOR_PROFILE_REPOSITORY = Symbol('IInstructorProfileRepository');

export interface IInstructorProfileRepository {
  findByUserId(userId: UniqueId): Promise<InstructorProfile | null>;
  save(profile: InstructorProfile): Promise<void>;
}



