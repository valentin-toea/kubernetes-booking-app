import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token missing');
    }

    try {
      const { data } = await axios.get(`${process.env.AUTH_API}/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      req['user'] = data;
      next();
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
