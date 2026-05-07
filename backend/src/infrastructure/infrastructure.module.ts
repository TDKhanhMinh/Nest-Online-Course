import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Schemas
import { UserSchema } from '@/database/schemas/user.schema';
import { InstructorProfileDocument, InstructorProfileSchema } from '@/database/schemas/instructor-profile.schema';
import { CourseDocument, CourseSchema } from '@/database/schemas/course.schema';
import { CategoryDocument, CategorySchema } from '@/database/schemas/category.schema';
import { SectionDocument, SectionSchema } from '@/database/schemas/section.schema';
import { LessonDocument, LessonSchema } from '@/database/schemas/lesson.schema';
import { ReviewDocument, ReviewSchema } from '@/database/schemas/review.schema';
import { EnrollmentDocument, EnrollmentSchema } from '@/database/schemas/enrollment.schema';
import { LessonProgressDocument, LessonProgressSchema } from '@/database/schemas/lesson-progress.schema';
import { OrderDocument, OrderSchema } from '@/database/schemas/order.schema';
import { OrderItemDocument, OrderItemSchema } from '@/database/schemas/order-item.schema';
import { TransactionDocument, TransactionSchema } from '@/database/schemas/transaction.schema';
import { CertificateDocument, CertificateSchema } from '@/database/schemas/certificate.schema';
import { CartDocument, CartSchema } from '@/database/schemas/cart.schema';
import { CartItemDocument, CartItemSchema } from '@/database/schemas/cart-item.schema';
import { WishlistDocument, WishlistSchema } from '@/database/schemas/wishlist.schema';

// Ports
import { IUSER_REPOSITORY } from '@domain/user/ports/i-user.repository';
import { IINSTRUCTOR_PROFILE_REPOSITORY } from '@domain/user/ports/i-instructor-profile.repository';
import { ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { ICATEGORY_REPOSITORY } from '@domain/course/ports/i-category.repository';
import { ISECTION_REPOSITORY } from '@domain/course/ports/i-section.repository';
import { ILESSON_REPOSITORY } from '@domain/course/ports/i-lesson.repository';
import { IREVIEW_REPOSITORY } from '@domain/course/ports/i-review.repository';
import { ILESSON_PROGRESS_REPOSITORY } from '@domain/course/ports/i-lesson-progress.repository';
import { IENROLLMENT_REPOSITORY } from '@domain/enrollment/ports/i-enrollment.repository';
import { IORDER_REPOSITORY } from '@domain/order/ports/i-order.repository';
import { ITRANSACTION_REPOSITORY } from '@domain/order/ports/i-transaction.repository';
import { ICERTIFICATE_REPOSITORY } from '@domain/certificate/ports/i-certificate.repository';
import { ICART_REPOSITORY } from '@domain/cart/ports/i-cart.repository';
import { ICART_ITEM_REPOSITORY } from '@domain/cart/ports/i-cart-item.repository';
import { IWISHLIST_REPOSITORY } from '@domain/student-features/ports/i-wishlist.repository';

// Repositories
import { MongooseUserRepository } from './persistence/mongoose/repositories/mongoose-user.repository';
import { MongooseInstructorProfileRepository } from './persistence/mongoose/repositories/mongoose-instructor-profile.repository';
import { MongooseCourseRepository } from './persistence/mongoose/repositories/mongoose-course.repository';
import { MongooseCategoryRepository } from './persistence/mongoose/repositories/mongoose-category.repository';
import { MongooseSectionRepository } from './persistence/mongoose/repositories/mongoose-section.repository';
import { MongooseLessonRepository } from './persistence/mongoose/repositories/mongoose-lesson.repository';
import { MongooseReviewRepository } from './persistence/mongoose/repositories/mongoose-review.repository';
import { MongooseLessonProgressRepository } from './persistence/mongoose/repositories/mongoose-lesson-progress.repository';
import { MongooseEnrollmentRepository } from './persistence/mongoose/repositories/mongoose-enrollment.repository';
import { MongooseOrderRepository } from './persistence/mongoose/repositories/mongoose-order.repository';
import { MongooseTransactionRepository } from './persistence/mongoose/repositories/mongoose-transaction.repository';
import { MongooseCertificateRepository } from './persistence/mongoose/repositories/mongoose-certificate.repository';
import { MongooseCartRepository } from './persistence/mongoose/repositories/mongoose-cart.repository';
import { MongooseCartItemRepository } from './persistence/mongoose/repositories/mongoose-cart-item.repository';
import { MongooseWishlistRepository } from './persistence/mongoose/repositories/mongoose-wishlist.repository';

// Auth Services
import { IPASSWORD_HASHER } from '@application/auth/ports/i-password-hasher';
import { ITOKEN_SERVICE } from '@application/auth/ports/i-token.service';
import { BcryptPasswordHasher } from './services/auth/bcrypt-password-hasher';
import { JwtTokenService } from './services/auth/jwt-token.service';

// Infrastructure Services
import { IFILE_STORAGE_SERVICE } from '@shared/abstractions/services/i-file-storage.service';
import { IVIDEO_STREAMING_SERVICE } from '@shared/abstractions/services/i-video-streaming.service';
import { IEMAIL_NOTIFICATION_SERVICE } from '@shared/abstractions/services/i-email-notification.service';
import { S3StorageAdapter } from './services/storage/s3-storage.adapter';
import { CloudinaryVideoAdapter } from './services/storage/cloudinary-video.adapter';
import { NodemailerAdapter } from './services/notification/nodemailer.adapter';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: InstructorProfileDocument.name, schema: InstructorProfileSchema },
      { name: CourseDocument.name, schema: CourseSchema },
      { name: CategoryDocument.name, schema: CategorySchema },
      { name: SectionDocument.name, schema: SectionSchema },
      { name: LessonDocument.name, schema: LessonSchema },
      { name: ReviewDocument.name, schema: ReviewSchema },
      { name: EnrollmentDocument.name, schema: EnrollmentSchema },
      { name: LessonProgressDocument.name, schema: LessonProgressSchema },
      { name: OrderDocument.name, schema: OrderSchema },
      { name: OrderItemDocument.name, schema: OrderItemSchema },
      { name: TransactionDocument.name, schema: TransactionSchema },
      { name: CertificateDocument.name, schema: CertificateSchema },
      { name: CartDocument.name, schema: CartSchema },
      { name: CartItemDocument.name, schema: CartItemSchema },
      { name: WishlistDocument.name, schema: WishlistSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1d') as any,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: IUSER_REPOSITORY,
      useClass: MongooseUserRepository,
    },
    {
      provide: IINSTRUCTOR_PROFILE_REPOSITORY,
      useClass: MongooseInstructorProfileRepository,
    },
    {
      provide: ICOURSE_REPOSITORY,
      useClass: MongooseCourseRepository,
    },
    {
      provide: ICATEGORY_REPOSITORY,
      useClass: MongooseCategoryRepository,
    },
    {
      provide: ISECTION_REPOSITORY,
      useClass: MongooseSectionRepository,
    },
    {
      provide: ILESSON_REPOSITORY,
      useClass: MongooseLessonRepository,
    },
    {
      provide: IREVIEW_REPOSITORY,
      useClass: MongooseReviewRepository,
    },
    {
      provide: ILESSON_PROGRESS_REPOSITORY,
      useClass: MongooseLessonProgressRepository,
    },
    {
      provide: IENROLLMENT_REPOSITORY,
      useClass: MongooseEnrollmentRepository,
    },
    {
      provide: IORDER_REPOSITORY,
      useClass: MongooseOrderRepository,
    },
    {
      provide: ITRANSACTION_REPOSITORY,
      useClass: MongooseTransactionRepository,
    },
    {
      provide: ICERTIFICATE_REPOSITORY,
      useClass: MongooseCertificateRepository,
    },
    {
      provide: ICART_REPOSITORY,
      useClass: MongooseCartRepository,
    },
    {
      provide: ICART_ITEM_REPOSITORY,
      useClass: MongooseCartItemRepository,
    },
    {
      provide: IWISHLIST_REPOSITORY,
      useClass: MongooseWishlistRepository,
    },
    {
      provide: IPASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: ITOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    {
      provide: IFILE_STORAGE_SERVICE,
      useClass: S3StorageAdapter,
    },
    {
      provide: IVIDEO_STREAMING_SERVICE,
      useClass: CloudinaryVideoAdapter,
    },
    {
      provide: IEMAIL_NOTIFICATION_SERVICE,
      useClass: NodemailerAdapter,
    },
  ],
  exports: [
    IUSER_REPOSITORY,
    IINSTRUCTOR_PROFILE_REPOSITORY,
    ICOURSE_REPOSITORY,
    ICATEGORY_REPOSITORY,
    ISECTION_REPOSITORY,
    ILESSON_REPOSITORY,
    IREVIEW_REPOSITORY,
    ILESSON_PROGRESS_REPOSITORY,
    IENROLLMENT_REPOSITORY,
    IORDER_REPOSITORY,
    ITRANSACTION_REPOSITORY,
    ICERTIFICATE_REPOSITORY,
    ICART_REPOSITORY,
    ICART_ITEM_REPOSITORY,
    IWISHLIST_REPOSITORY,
    IPASSWORD_HASHER,
    ITOKEN_SERVICE,
    IFILE_STORAGE_SERVICE,
    IVIDEO_STREAMING_SERVICE,
    IEMAIL_NOTIFICATION_SERVICE,
    JwtModule,
  ],
})
export class InfrastructureModule {}

