import { Entity } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface WishlistProps {
  userId: string;
  courseId: string;
}

export class Wishlist extends Entity<WishlistProps> {
  get userId(): string {
    return this.props.userId;
  }

  get courseId(): string {
    return this.props.courseId;
  }

  public static create(props: WishlistProps): Wishlist {
    return new Wishlist(props, UniqueId.generate());
  }

  public static reconstitute(props: WishlistProps, id: string): Wishlist {
    return new Wishlist(props, new UniqueId(id));
  }
}



