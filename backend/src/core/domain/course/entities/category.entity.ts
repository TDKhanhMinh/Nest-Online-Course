import { Entity } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface CategoryProps {
  name: string;
  slug: string;
  parentId?: UniqueId;
}

export class Category extends Entity<CategoryProps> {
  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get parentId(): UniqueId | undefined {
    return this.props.parentId;
  }

  public update(props: { name?: string; slug?: string; parentId?: UniqueId | null }): void {
    if (props.name !== undefined) this.props.name = props.name;
    if (props.slug !== undefined) this.props.slug = props.slug;
    if (props.parentId !== undefined) {
      this.props.parentId = props.parentId === null ? undefined : props.parentId;
    }
  }



  public static create(props: CategoryProps, id?: UniqueId): Category {
    return new Category(
      props,
      id ?? UniqueId.generate(),
    );
  }

  public static reconstitute(props: CategoryProps, id: UniqueId): Category {
    return new Category(props, id);
  }
}



