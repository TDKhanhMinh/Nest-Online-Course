import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri:
    process.env.MONGODB_URI ??
    `mongodb://${process.env.MONGODB_HOST ?? 'localhost'}:${process.env.MONGODB_PORT ?? '27017'}/${process.env.MONGODB_DB ?? 'online_learning'}`,
}));



