import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
            clientSecret: configService.get<string>('FACEBOOK_SECRET'),
            callbackURL: configService.get<string>('FACEBOOK_CALL_BACK_URL'),
            scope: 'email',
            profileFields: ['emails', 'name', 'picture.type(large)'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            username: emails[0].value,
            fullName: `${name.givenName} ${name.familyName}`,
            avatar: {
                url: photos[0].value,
                publicId: ""
            },
            isVerified: true,
        };
        done(null, user);
    }
}