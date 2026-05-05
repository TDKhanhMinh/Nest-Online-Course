import { InstructorProfile } from '@/api/user/entities/instructor-profile.entity';

export const IInstructorProfileRepository = Symbol('IInstructorProfileRepository');

export interface IInstructorProfileRepository {
  findByUserId(userId: string): Promise<InstructorProfile | null>;
  save(profile: InstructorProfile): Promise<void>;
}
