import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { PROVIDERS } from '@app/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        @Inject(PROVIDERS.CUSTOMER_SERVICE) private readonly customerAuthService: ClientProxy
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_CALL_BACK_URL'),
            scope: ['email', 'profile'],
            prompt: 'select_account',
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, id, photos } = profile;
        const data = {
            googleId: id,
            email: emails[0].value,
            fullName: `${name.givenName} ${name.familyName}`,
            isVerified: true,
            avatar: {
                url: photos[0].value,
                publicId: "",
            },
        };
        const user = await firstValueFrom(this.customerAuthService.send('login_google', data))
        done(null, user.data);
    }
}