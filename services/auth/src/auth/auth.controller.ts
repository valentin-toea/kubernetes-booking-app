import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() userDto: { username: string; password: string }) {
    return this.authService.register(userDto);
  }

  @Get('validate')
  validateToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token missing');
    }

    return this.authService.validateToken(token);
  }
}
