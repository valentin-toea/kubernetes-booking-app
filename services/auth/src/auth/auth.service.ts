import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async register(userDto: {
    username: string;
    password: string;
  }): Promise<any> {
    const { username, password } = userDto;

    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.create({
      username,
      password: hashedPassword,
    });

    return { id: newUser.id, username: newUser.username };
  }
}
