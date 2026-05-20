import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUSER_REPOSITORY, IUserRepository } from '@domain/user/ports/i-user.repository';
import { IPASSWORD_HASHER, IPasswordHasher } from '@application/auth/ports/i-password-hasher';
import { User } from '@domain/user/entities/user.entity';
import { Role } from '@shared/types/role.enum';

export async function createAdminIfNotExist(app: INestApplicationContext): Promise<void> {
  const configService = app.get(ConfigService);
  const userRepository = app.get<IUserRepository>(IUSER_REPOSITORY);
  const passwordHasher = app.get<IPasswordHasher>(IPASSWORD_HASHER);

  const adminEmail = configService.get<string>('ADMIN_EMAIL') || 'admin@example.com';
  const adminPassword = configService.get<string>('ADMIN_PASSWORD') || 'admin123';
  const adminFullName = configService.get<string>('ADMIN_FULLNAME') || 'System Administrator';

  try {
    const existingAdmin = await userRepository.findByEmail(adminEmail);
    if (!existingAdmin) {
      console.log(`[Seed] Admin user ${adminEmail} does not exist. Creating...`);
      const passwordHash = await passwordHasher.hash(adminPassword);
      const adminUser = User.create({
        fullName: adminFullName,
        email: adminEmail,
        passwordHash,
        roles: [Role.ADMIN],
        isActive: true,
      });

      await userRepository.save(adminUser);
      console.log(`[Seed] Admin user ${adminEmail} successfully created.`);
    } else {
      console.log(`[Seed] Admin user ${adminEmail} already exists.`);
    }
  } catch (error) {
    console.error('[Seed] Failed to create admin user:', error);
  }
}
