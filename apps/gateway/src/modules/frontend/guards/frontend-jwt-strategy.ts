// customer-auth/src/auth/customer-jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, 'frontend-jwt') {
    constructor(
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('CUS_ACCESS_TOKEN_KEY'),
        });
    }
    async validate(payload: any) {
        return { userId: payload._id, fullName: payload.fullName, username: payload.username, avatarUrl: payload.avatarUrl };
    }
}
