import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        const refreshToken = uuidv4();
        await this.userService.saveRefreshToken(user.id, refreshToken);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken,
        };
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if (user && await bcrypt.compare(pass, user.password_hash)) {
            const {password_hash, ...result} = user;
            return result;
        }
        return null;
    }

    async refreshToken(username: string, refreshToken: string) {
        const user = await this.userService.findOne(username);
        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedException();
        }
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateRefreshToken(username: string, refreshToken: string): Promise<void> {
        const user = await this.userService.findOne(username);
        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedException();
        }
    }
}
