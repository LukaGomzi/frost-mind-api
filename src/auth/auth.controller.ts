import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshTokenGuard } from "../guards/refresh-token/refresh-token.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refresh(@Body() body: { username: string; refreshToken: string }) {
        return this.authService.refreshToken(body.username, body.refreshToken);
    }
}
