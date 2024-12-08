import { Controller, Post, Body, HttpException, HttpStatus, Put, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
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
  ): Promise<{ token: string }> {
    const { userId, password } = body;
    const token = await this.userService.validateUser(userId, password);
    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { token };
  }

  @Put('password')
  async updatePassword(
    @Body() body: { userId: string; oldPassword: string; newPassword: string },
  ) {
    const { userId, oldPassword, newPassword } = body;
    const result = await this.userService.updatePassword(userId, oldPassword, newPassword);
    if (!result) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { message: 'Password updated successfully' };
  }
}
