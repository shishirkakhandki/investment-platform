import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body() body: { username: string; email: string; password: string },
  ): Promise<string> {
    const { username, email, password } = body;
    const user = await this.userService.createUser(username, email, password);
    if (!user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    return 'User created successfully';
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ token: string }> {
    const { email, password } = body;
    const token = await this.userService.validateUser(email, password);
    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { token };
  }
}
