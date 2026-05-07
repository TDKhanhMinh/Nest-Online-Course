import { Inject, Injectable } from '@nestjs/common';
import { 
  IWishlistRepository, 
  IWISHLIST_REPOSITORY 
} from '@domain/student-features/ports/i-wishlist.repository';
import { WishlistResponseDto } from '../dto/wishlist.dto';

@Injectable()
export class GetWishlistUseCase {
  constructor(
    @Inject(IWISHLIST_REPOSITORY)
    private readonly wishlistRepo: IWishlistRepository,
  ) {}

  async execute(userId: string): Promise<WishlistResponseDto[]> {
    const wishlist = await this.wishlistRepo.findByUserId(userId);
    
    return wishlist.map(item => ({
      id: item.id.value,
      userId: item.userId,
      courseId: item.courseId,
    }));
  }
}
