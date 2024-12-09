// src/user/user.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Put,
  Get,
  Param,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import the JWT guard

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @Get(':userId')
  @UseGuards(JwtAuthGuard) // Use the JWT Auth Guard
  async getUser(@Param('userId') userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post('signup')
  async signup(
    @Body() body: { username: string; userId: string; password: string },
  ): Promise<string> {
    const { username, userId, password } = body;
    const user = await this.userService.createUser(username, userId, password);
    if (!user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    return 'User created successfully';
  }

  @Post('login')
  async login(
    @Body() body: { userId: string; password: string },
  ): Promise<{ token: string } | { message: string }> {
    const { userId, password } = body;

    try {
      const token = await this.userService.validateUser(userId, password);
      if (!token) {
        this.logger.warn(`Login failed for user: ${userId}`);
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return { token };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Unexpected error during login', error.stack);
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('password')
  @UseGuards(JwtAuthGuard) // Protect this route with JWT guard
  async updatePassword(
    @Body() body: { userId: string; oldPassword: string; newPassword: string },
  ) {
    const { userId, oldPassword, newPassword } = body;
    const result = await this.userService.updatePassword(
      userId,
      oldPassword,
      newPassword,
    );
    if (!result) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { message: 'Password updated successfully' };
  }
}
