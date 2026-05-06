import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoryDocument } from '@/database/schemas/category.schema';

@Injectable()
export class CategoryMapper {
  public toDomain(doc: CategoryDocument): Category {
    return Category.reconstitute(
      {
        name: doc.name,
        slug: doc.slug,
        parentId: doc.parentId?.toString(),
      },
      (doc._id as any).toString(),
    );
  }

  public toPersistence(domain: Category): any {
    return {
      _id: domain.id.value,
      name: domain.name,
      slug: domain.slug,
      parentId: domain.parentId,
    };
  }
}
