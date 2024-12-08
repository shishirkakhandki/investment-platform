import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserRepository } from './user.repository';
import * as dotenv from 'dotenv'; // Import dotenv

// Load environment variables before accessing them
dotenv.config({ path: __dirname + '/../../.env' });

@Module({
  imports: [
    // Log MONGO_URI to verify it's loaded correctly
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
export class UserModule {
  // You can log to verify the MONGO_URI in the module
  constructor() {
    console.log('MONGO_URI in UserModule:', process.env.MONGO_URI);
  }
}
