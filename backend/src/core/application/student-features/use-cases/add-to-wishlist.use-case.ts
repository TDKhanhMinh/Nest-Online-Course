import { Inject, Injectable } from '@nestjs/common';
import { 
  IWishlistRepository, 
  IWISHLIST_REPOSITORY 
} from '@domain/student-features/ports/i-wishlist.repository';
import { Wishlist } from '@domain/student-features/entities/wishlist.entity';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';
import { AddToWishlistDto, WishlistResponseDto } from '../dto/wishlist.dto';

@Injectable()
export class AddToWishlistUseCase {
  constructor(
    @Inject(IWISHLIST_REPOSITORY)
    private readonly wishlistRepo: IWishlistRepository,
  ) {}

  async execute(userId: string, dto: AddToWishlistDto): Promise<WishlistResponseDto> {
    // 1. Check if already in wishlist
    const existing = await this.wishlistRepo.findOne(userId, dto.courseId);
    if (existing) {
      throw new DomainException(
        ErrorCode.ALREADY_IN_WISHLIST,
        'This course is already in your wishlist',
      );
    }

    // 2. Create entity
    const wishlist = Wishlist.create({
      userId,
      courseId: dto.courseId,
    });

    // 3. Save
    await this.wishlistRepo.save(wishlist);

    return {
      id: wishlist.id.value,
      userId: wishlist.userId,
      courseId: wishlist.courseId,
    };
  }
}
