import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserRepository } from './user.repository';
import { AuthMiddleware } from '../auth/auth.middleware';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: __dirname + '/../../.env' });

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, UserRepository],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('user/signup', 'user/login') // Exclude routes that don't require authentication
      .forRoutes('user/*');
  }

  constructor() {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
  }
}
