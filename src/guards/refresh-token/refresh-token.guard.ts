import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from "../../auth/auth.service";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
      context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refreshToken, username } = request.body;

    if (!refreshToken || !username) {
      throw new UnauthorizedException('Missing token or username');
    }

    return this.validateToken(username, refreshToken);
  }

  async validateToken(username: string, refreshToken: string): Promise<boolean> {
    try {
      await this.authService.validateRefreshToken(username, refreshToken);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
