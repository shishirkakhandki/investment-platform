import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  // Create a new user
  async createUser(username: string, userId: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.createUser({ username, userId, password: hashedPassword });
  }

  // Validate a user for login and generate JWT token
  async validateUser(userId: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByUserId(userId);
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.jwtService.sign({ userId: user._id });
    }
    return null;
  }

  // Update user password
  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return false;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);
    return true;
  }

  // Fetch user details by userId
  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
