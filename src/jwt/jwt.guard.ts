import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('토큰이 누락되었거나 올바르지 않습니다.');
    }

    const receivedToken = authorizationHeader.split(' ')[1];
    const [receivedHeader, receivedPayload, receivedSignature] =
      receivedToken.split('.');

    if (!this.jwtService.verifyToken(receivedToken)) {
      throw new UnauthorizedException('위/변조된 올바르지 않은 토큰입니다.');
    }

    const decodedPayload = JSON.parse(
      Buffer.from(receivedPayload, 'base64').toString('utf-8'),
    );

    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('만료된 토큰입니다.');
    }
    request.user = decodedPayload;
    return true;
  }
}
