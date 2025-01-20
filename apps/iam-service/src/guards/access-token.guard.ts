import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IAccessTokenPayload } from '../common/access-token-payload.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        message: 'Access token is required',
      });
    }

    let payload: IAccessTokenPayload;
    try {
      payload = await this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException({
        message: 'Invalid token payload',
      });
    }

    if (!payload.userId) {
      throw new UnauthorizedException('Invalid token payload');
    } else {
      request['userId'] = payload.userId;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
