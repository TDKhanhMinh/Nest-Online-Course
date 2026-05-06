import { Entity } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';

export interface CartItemProps {
  userId: string;
  courseId: string;
}

export class CartItem extends Entity<CartItemProps> {
  get userId(): string {
    return this.props.userId;
  }

  get courseId(): string {
    return this.props.courseId;
  }

  public static create(props: CartItemProps): CartItem {
    return new CartItem(props, UniqueId.generate());
  }

  public static reconstitute(props: CartItemProps, id: string): CartItem {
    return new CartItem(props, new UniqueId(id));
  }
}
