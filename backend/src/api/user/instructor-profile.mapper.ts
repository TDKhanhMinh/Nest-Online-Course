import { Injectable } from '@nestjs/common';
import { InstructorProfile } from '@/api/user/entities/instructor-profile.entity';
import { InstructorProfileDocument } from '@/database/schemas/instructor-profile.schema';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class InstructorProfileMapper {
  toDomain(doc: InstructorProfileDocument): InstructorProfile {
    return InstructorProfile.reconstitute(
      {
        userId: new UniqueId(doc.userId),
        headline: doc.headline,
        biography: doc.biography,
        totalStudents: doc.totalStudents,
        website: doc.website,
        twitter: doc.twitter,
        linkedin: doc.linkedin,
        youtube: doc.youtube,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  toPersistence(domain: InstructorProfile): any {
    return {
      _id: domain.id.value as any,
      userId: domain.userId.value,
      headline: domain.headline,
      biography: domain.biography,
      totalStudents: domain.totalStudents,
      website: domain.website,
      twitter: domain.twitter,
      linkedin: domain.linkedin,
      youtube: domain.youtube,
    };
  }
}
