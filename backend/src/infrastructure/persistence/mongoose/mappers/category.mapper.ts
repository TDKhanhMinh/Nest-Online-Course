import { Category } from '@domain/course/entities/category.entity';
import { CategoryDocument } from '@/database/schemas/category.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class CategoryMapper {
  static toDomain(doc: CategoryDocument): Category {
    return Category.reconstitute(
      {
        name: doc.name,
        slug: doc.slug,
        parentId: doc.parentId ? new UniqueId(doc.parentId.toString()) : undefined,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Category): any {
    return {
      _id: domain.id.value,
      name: domain.name,
      slug: domain.slug,
      parentId: domain.parentId?.value,
    };
  }
}
