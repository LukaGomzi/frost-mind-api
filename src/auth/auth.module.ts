import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: 'secretKey', // Use an environment variable for the secret in production
            signOptions: { expiresIn: '30 days' },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
