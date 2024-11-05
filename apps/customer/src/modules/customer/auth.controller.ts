import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { ILogin, IRegister, IForgotPassword, IUpdatePassword, IRefreshToken, IChangePassword, IToken, IUpdateCustomer } from './auth.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('login')
  async login(@Payload() payload: { lang: string } & ILogin) {
    console.log({ payload })
    const { lang, ...loginDto } = payload;
    return this.authService.login(loginDto, lang);
  }

  @MessagePattern('register')
  async register(@Payload() payload: { lang: string } & IRegister) {
    const { lang, ...registerDto } = payload;
    return this.authService.register(registerDto, lang);
  }

  @MessagePattern('verify_email')
  async verifyEmail(@Payload() payload: { lang: string } & IToken) {
    const { lang, ...body } = payload;
    return this.authService.verifyEmail(body, lang);
  }

  @MessagePattern('forgot_password')
  async forgotPassword(@Payload() payload: { lang: string } & IForgotPassword) {
    const { lang, ...body } = payload;
    return this.authService.forgotPassword(body, lang);
  }

  @MessagePattern('verify_forgot_password')
  async verifyForgotPassword(@Payload() payload: { lang: string } & IToken) {
    const { lang, ...body } = payload;
    return this.authService.verifyForgotPasswordToken(body, lang);
  }

  @MessagePattern('update_password')
  async updatePassword(@Payload() payload: { lang: string } & IUpdatePassword) {
    const { lang, ...body } = payload;
    return this.authService.updatePassword(body, lang);
  }

  @MessagePattern('refresh_token')
  async refreshToken(@Payload() payload: { lang: string } & IRefreshToken) {
    const { lang, ...body } = payload;
    return this.authService.refreshToken(body, lang);
  }

  @MessagePattern('change_password')
  async changePassword(@Payload() payload: { userId: string; body: IChangePassword; lang: string; }) {
    const { userId, body, lang } = payload;
    return this.authService.changePassword(userId, body, lang);
  }

  @MessagePattern('check_bio_link')
  async checkBioLink(@Payload() payload: { bioLink: string }) {
    const { bioLink } = payload;
    return await this.authService.hasExistBioLink(bioLink);
  }

  @MessagePattern('login_google')
  async loginGoogle(@Payload() { googleId, email, fullName, isVerified, avatar }: { googleId: string, email: string, fullName: string, isVerified: boolean, avatar: any }) {
    return await this.authService.loginGoogleService({ googleId, email, fullName, isVerified, avatar })
  }

  @MessagePattern('create_password')
  async createPassword(@Payload() { password, googleId, lang }: { password: string, googleId: string, lang: string }) {
    return await this.authService.createPasswordService({ password, googleId, lang })
  }

  @MessagePattern('get_account')
  async getAccount(@Payload() { userId, lang }: { userId: string, lang: string }) {
    return await this.authService.getAccountService(userId, lang)
  }

  
  @MessagePattern('update_customer')
  async updateCustomer(@Payload() body: IUpdateCustomer) {
    return await this.authService.updateCustomerService(body)
  }

  @MessagePattern('save_rate')
  async saveRate(@Payload() { rates }: {rates: any}) {
    return await this.authService.saveRateService(rates)
  }

  @MessagePattern('get_users_by_ids')
  async getUsersByIds(@Payload() { userIds }: { userIds: string[] }) {
    return this.authService.getUsersByIdsService(userIds)
  }

  @MessagePattern('update_plan')
  async updatePlan(@Payload() { userId, plan }: { userId: string, plan: string }) {
    return this.authService.updatePlan(userId, plan)
  }

  @MessagePattern('update_address')
  async updateAddress(@Payload() payload: { userId: string, address: any, lang: string }) {
    const { userId, address, lang } = payload;
    return this.authService.updateAddressService(userId, address, lang);
  }

  @MessagePattern('get_customer_plan')
  async getCustomerPlan(@Payload() payload: { userId: string, lang: string }) {
    const { userId, lang } = payload;
    return this.authService.getCustomerPlanService(userId, lang);
  }

  @MessagePattern('get_profile_slug')
  async getProfileSlug(@Payload() payload: {username:string, lang: string}) {
    const {username, lang} = payload;
    return this.authService.getProfileSlugService(username, lang);
  }

  @MessagePattern('get_user_by_id')
  async getUserById(@Payload() payload: { userId: string, lang: string }) {
    const { userId, lang } = payload;
    return this.authService.getUserByIdService(userId, lang);
  }
}
