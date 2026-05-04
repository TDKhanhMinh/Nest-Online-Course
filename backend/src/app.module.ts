import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import databaseConfig from '@/config/database.config';
import { CourseModule } from '@/api/course/course.module';
import { EnrollmentModule } from '@/api/enrollment/enrollment.module';
import { CertificateModule } from '@/api/certificate/certificate.module';
import { UserModule } from '@/api/user/user.module';
import { AuthModule } from '@/api/auth/auth.module';

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
  ],
})
export class AppModule { }
