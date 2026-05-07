import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import databaseConfig from '@/database/config/database.config';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { AuthWebModule } from '@presentation/web/controllers/auth/auth.web.module';
import { CartWebModule } from '@presentation/web/controllers/cart/cart.web.module';
import { CertificateWebModule } from '@presentation/web/controllers/certificate/certificate.web.module';
import { CourseWebModule } from '@presentation/web/controllers/course/course.web.module';
import { EnrollmentWebModule } from '@presentation/web/controllers/enrollment/enrollment.web.module';
import { OrderWebModule } from '@presentation/web/controllers/order/order.web.module';
import { StudentFeaturesWebModule } from '@presentation/web/controllers/student-features/student-features.web.module';
import { UserWebModule } from '@presentation/web/controllers/user/user.web.module';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.uri'),
      }),
    }),

    InfrastructureModule,

    EventEmitterModule.forRoot({ wildcard: false }),
    ScheduleModule.forRoot(),

    CourseWebModule,
    EnrollmentWebModule,
    CertificateWebModule,
    UserWebModule,
    AuthWebModule,
    OrderWebModule,
    CartWebModule,
    StudentFeaturesWebModule,
  ],
})
export class AppModule { }



