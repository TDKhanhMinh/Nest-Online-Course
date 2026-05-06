import { AuthModule } from '@/api/auth/auth.module';
import { CartModule } from '@/api/cart/cart.module';
import { CertificateModule } from '@/api/certificate/certificate.module';
import { CourseModule } from '@/api/course/course.module';
import { EnrollmentModule } from '@/api/enrollment/enrollment.module';
import { OrderModule } from '@/api/order/order.module';
import { StudentFeaturesModule } from '@/api/student-features/student-features.module';
import { UserModule } from '@/api/user/user.module';
import databaseConfig from '@/database/config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // ── MongoDB via Mongoose ──────────────────────────────────────────────────
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.uri'),
      }),
    }),

    EventEmitterModule.forRoot({ wildcard: false }),
    ScheduleModule.forRoot(),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret'),
        signOptions: { expiresIn: '7d' },
      }),
    }),

    CourseModule,
    EnrollmentModule,
    CertificateModule,
    UserModule,
    AuthModule,
    OrderModule,
    CartModule,
    StudentFeaturesModule,
  ],
})
export class AppModule { }
