import { Inject, Injectable } from '@nestjs/common';
import { 
  IWishlistRepository, 
  IWISHLIST_REPOSITORY 
} from '@domain/student-features/ports/i-wishlist.repository';

@Injectable()
export class RemoveFromWishlistUseCase {
  constructor(
    @Inject(IWISHLIST_REPOSITORY)
    private readonly wishlistRepo: IWishlistRepository,
  ) {}

  async execute(userId: string, courseId: string): Promise<void> {
    await this.wishlistRepo.delete(userId, courseId);
  }
}
