import { ChangePasswordDto, CreatePassword, ForgotPasswordDto, getLangFromRequest, IUser, LoginDto, PROVIDERS, RefreshTokenDto, RegisterDto, UpdatePasswordDto, User, VerifyEmailDto, VerifyForgotPasswordDto } from "@app/common";
import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from "rxjs";
import { FacebookAuthGuard } from "../guards/facebook-auth.guard";
import { FrontendAuthGuard } from "../guards/frontend-auth.guard";
import { GoogleAuthGuard } from "../guards/google-auth.guard";

@ApiTags('Customer Authentication')
@Controller('frontend-api/frontend-auth')
export class FrontendAuthController {
    constructor(
        private readonly configService: ConfigService,
        @Inject(PROVIDERS.CUSTOMER_SERVICE) private readonly customerAuthService: ClientProxy
    ) { }

    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @Post('register')
    async register(@Body() body: RegisterDto, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerAuthService.send('register', { ...body, lang }));
    }

    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(@Body() body: LoginDto, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerAuthService.send('login', { ...body, lang }));
    }

    @ApiOperation({ summary: 'Verify email' })
    @ApiBody({ type: VerifyEmailDto })
    @Post('register/verify-email')
    async verifyEmail(@Body() body: VerifyEmailDto, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerAuthService.send('verify_email', { ...body, lang }));
    }

    @ApiOperation({ summary: 'Send forgot password email' })
    @ApiBody({ type: ForgotPasswordDto })
    @Post('forgot-password/send-email')
    async forgotPassword(@Body() body: ForgotPasswordDto, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerAuthService.send('forgot_password', { ...body, lang }));
    }

    @ApiOperation({ summary: 'Verify forgot password token' })
    @ApiBody({ type: VerifyForgotPasswordDto })
    @Post('forgot-password/verify-token')
    async verifyForgotPassword(@Body() body: VerifyForgotPasswordDto, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerAuthService.send('verify_forgot_password', { ...body, lang }));
    }

    @ApiOperation({ summary: 'Update password' })
    @ApiBody({ type: UpdatePasswordDto })
    @Post('forgot-password/update-password')
    async updatePassword(@Body() body: UpdatePasswordDto, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerAuthService.send('update_password', { ...body, lang }));
    }

    @ApiOperation({ summary: 'Refresh token' })
    @ApiBody({ type: RefreshTokenDto })
    @Post('refresh-token')
    async refreshToken(@Body() body: RefreshTokenDto, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerAuthService.send('refresh_token', { ...body, lang }));
    }

    @ApiOperation({ summary: 'Change password' })
    @ApiBearerAuth()
    @ApiBody({ type: ChangePasswordDto })
    @UseGuards(FrontendAuthGuard)
    @Post('change-password')
    async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
        @Req() req: Request,
        @User() user: IUser
    ) {
        const userId = user.userId;
        const lang = getLangFromRequest(req)
        if (!userId) {
            throw new RpcException('User ID is missing');
        }

        const message = {
            userId,
            body: changePasswordDto,
            lang
        };

        return await firstValueFrom(this.customerAuthService.send('change_password', message));
    }

    @ApiOperation({ summary: `Follow URL http://localhost:8000/frontend-api/frontend-auth/google` })
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    googleAuth() { }

    @Get('auth/google/callback')
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Req() req: any, @Res() res: any, @Req() query: any) {
        const { error } = query
        if (error === "access_denied") return res.redirect(`${this.configService.get<string>('FRONT_END_URL')}`)

        return res.redirect(`${this.configService.get<string>('FRONT_END_URL')}?accessToken=${req.user.accessToken}&refeshToken=${req.user.refreshToken}`)
    }

    @Post('create_password')
    async createPassword(@Body() body: CreatePassword, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerAuthService.send('create_password', { ...body, lang }))
    }

    @Get('facebook')
    @UseGuards(FacebookAuthGuard)
    facebookAuth() { }

    @Get('auth/facebook/callback')
    @UseGuards(GoogleAuthGuard)
    facebookAuthRedirect(@Req() req: any) {
        // Implementation needed
    }
}