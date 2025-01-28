import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.userService.findByUserId(userId);
  }

  @Get(':username')
  async findOneByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }
}
