import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserEntity } from '../schema/createUser.schema';
import { verify } from 'jsonwebtoken';
import { TOKEN_KEY } from '../jwt.token';
import { AuthService } from '../auth.service';

export interface ExpressRequest extends Request {
  user?: UserEntity;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers['authorization'].split(' ')[1];

    try {
      const decode = verify(token, TOKEN_KEY) as { email: string };
      const user = await this.authService.findByEmail(decode.email);
      req.user = user;
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  }
}
