import { Entity } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';

export interface CategoryProps {
  name: string;
  slug: string;
  parentId?: string;
}

export class Category extends Entity<CategoryProps> {
  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get parentId(): string | undefined {
    return this.props.parentId;
  }

  public update(props: Partial<CategoryProps>): void {
    if (props.name !== undefined) this.props.name = props.name;
    if (props.slug !== undefined) this.props.slug = props.slug;
    if (props.parentId !== undefined) this.props.parentId = props.parentId;
  }

  public static create(props: CategoryProps, id?: string): Category {
    return new Category(
      props,
      id ? new UniqueId(id) : UniqueId.generate(),
    );
  }

  public static reconstitute(props: CategoryProps, id: string): Category {
    return new Category(props, new UniqueId(id));
  }
}
