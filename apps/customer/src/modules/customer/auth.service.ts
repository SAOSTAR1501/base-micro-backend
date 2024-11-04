import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { isEmpty } from 'class-validator';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { firstValueFrom } from 'rxjs';
import {
  IForgotPassword,
  ILogin,
  IRefreshToken,
  IRegister,
  IToken,
  IUpdateCustomer,
  IUpdatePassword
} from './auth.interface';
import { Customer, Rate } from '@app/common';
import { payloadResgiterNoti } from '../../const/payload.const';
import { BulkWriteResult } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Rate.name) private rateModel: Model<Rate>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('BIO_SERVICE') private bioService: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
    @Inject('SEARCH_SERVICE') private searchService: ClientProxy,
    private readonly i18n: I18nService,
  ) { }

  private async indexCustomerEntity(customer: Customer, operation: 'create' | 'update' | 'delete'): Promise<void> {
    const entityData = operation === 'delete' ? { id: customer._id } : {
      id: customer._id,
      name: customer.fullName || customer.username,
      content: `${customer.username} ${customer.fullName}`.toLowerCase().trim(),
      additionalInfo: {
        phoneNumber: customer.phoneNumber,
        gender: customer.gender,
        dateOfBirth: customer.dateOfBirth,
        address: customer.address
      },
      imageUrl: customer.avatar?.url || '',
      link: customer.username || ''
    };

    await firstValueFrom(this.searchService.send('index_entity', {
      entity: entityData,
      entityType: 'customer',
      operation
    }));
  }

  async login(body: ILogin, lang: string) {
    const { email, password } = body;
    const customer = await this.customerModel.findOne({ email });
    if (!customer) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('error.account_not_registered', { lang }),
      });
    }

    if (!customer.password) {
      throw new RpcException({
        statusCode: 401,
        message: this.i18n.t('error.password_not_exist', { lang }),
        data: {
          isPassword: false,
          googleId: customer.googleId,
        },
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, customer.password);
    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: 401,
        message: this.i18n.t('error.invalid_username_or_password', { lang }),
      });
    }

    if (!customer.isVerified) {
      throw new RpcException(
        {
          statusCode: 400,
          message: this.i18n.t('error.account_not_verified', { lang })
        }
      );
    }

    const bioLink = await firstValueFrom(
      this.bioService.send('find_by_user', customer._id.toString()),
    );

    const tokenPayload = {
      _id: customer._id,
      username: customer.username,
      fullName: customer.fullName,
      email: customer.email,
      avatarUrl: customer.avatar?.url || '',
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('CUS_ACCESS_TOKEN_KEY'),
      expiresIn: this.configService.get<string>('CUS_ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('CUS_REFRESH_TOKEN_KEY'),
      expiresIn: this.configService.get<string>('CUS_REFRESH_TOKEN_EXPIRES_IN'),
    });

    return {
      result: {
        accessToken,
        refreshToken,
        customer: tokenPayload,
        bio: bioLink.data
      },
    };
  }

  async register(body: IRegister, lang: string) {
    const { email, bioLink, password, fullName } = body;
    // Extract username from email
    const username = email.split('@')[0];
    const existingCustomer = await this.customerModel.findOne({
      $or: [{ email }, { username }]
    });

    if (existingCustomer) {
      throw new RpcException({
        statusCode: 409,
        message: this.i18n.t('error.email_or_username_already_exists', { lang }),
        data: {
          field: existingCustomer.email === email ? 'email' : 'username',
        },
      });
    }

    const resBio = await firstValueFrom(
      this.bioService.send('exists_bio_link', bioLink),
    );

    if (!isEmpty(resBio.data)) {
      throw new RpcException({
        statusCode: 409,
        message: this.i18n.t('error.bio_already_exists', { lang }),
        data: {
          field: 'bioLink',
        },
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newCustomer = new this.customerModel({
      email,
      username,
      password: hashedPassword,
      fullName,
      isVerified: false,
      avatar: {
        url: `https://avatar.iran.liara.run/username?username=${fullName}`,
        publicId: '',
      },
    });

    await newCustomer.save();
    await this.indexCustomerEntity(newCustomer, 'create');

    const token = this.jwtService.sign(
      { customerID: newCustomer._id, email, bioLink, fullName, username: newCustomer.username },
      {
        secret: this.configService.get<string>(
          'CUS_SEND_EMAIL_REGISTER_SECRET',
        ),
        expiresIn: '7d',
      },
    );
    await firstValueFrom(
      this.notificationService.send('send_email_register', { email, token }),
    );

    return {
      statusCode: 200,
      message: this.i18n.t('message.checkEmailToVerify', { lang })
    };
  }

  async verifyEmail(body: IToken, lang: string) {
    const { token } = body;
    let payload = null;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>(
          'CUS_SEND_EMAIL_REGISTER_SECRET',
        ),
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new RpcException({
          statusCode: 401,
          message: this.i18n.t('error.tokenExpired', { lang }),
        });
      } else {
        throw new RpcException({
          statusCode: 401,
          message: this.i18n.t('error.verification_failed', { lang }),
        });
      }
    }
    const { customerID, fullName, bioLink, username } = payload;
    const customer = await this.customerModel.findById(customerID);
    if (!customer) {
      throw new RpcException(
        {
          statusCode: 400,
          message: this.i18n.t('error.verification_failed', { lang })
        }
      );
    }

    const resBio = await firstValueFrom(
      this.bioService.send('find_by_bio_link', bioLink),
    );
    const existingBio = resBio.data;

    if (!isEmpty(existingBio)) {
      throw new RpcException({
        statusCode: 409,
        message: this.i18n.t('error.bio_already_exists', { lang })
      });
    }

    customer.isVerified = true;
    customer.isActive = true;
    await Promise.all([
      customer.save(),
      firstValueFrom(
        this.bioService.send('create_bio', {
          userId: customerID,
          fullName,
          bioLink,
          avatar: {
            publicId: '',
            url: `https://avatar.iran.liara.run/username?username=${fullName}`,
          },
        }),
      ),
    ]);

    const payloadNoti = payloadResgiterNoti({ _id: customerID, fullName, username });

    await firstValueFrom(this.notificationService.send("create_notification", payloadNoti))

    return {
      statusCode: 200,
      message: this.i18n.t('message.verifySuccess', { lang })
    };
  }

  async forgotPassword(body: IForgotPassword, lang: string) {
    const { email } = body;
    const customer = await this.customerModel.findOne({ username: email });

    if (!customer) {
      throw new RpcException(
        {
          statusCode: 404,
          message: this.i18n.t('error.account_does_not_exist', { lang })
        }
      );
    }

    const currentTime = Date.now();
    if (customer.sendForgotPwExp && currentTime < customer.sendForgotPwExp) {
      throw new RpcException(
        {
          statusCode: 400,
          message: this.i18n.t('error.please_try_again_later', { lang })
        },
      );
    }

    const token = this.jwtService.sign(
      { customerID: customer._id, username: customer.username },
      {
        secret: this.configService.get<string>(
          'CUS_SEND_EMAIL_FORGOT_PW_SECRET',
        ),
        expiresIn: '5m',
      },
    );

    const tokenExpiration = currentTime + 5 * 60 * 1000;

    await Promise.all([
      this.customerModel.updateOne(
        { _id: customer._id },
        { $set: { sendForgotPwExp: tokenExpiration } },
      ),
      firstValueFrom(
        this.notificationService.send('send_email_forgot_password', { email, token }),
      ),
    ]);

    return { statusCode: 200, message: this.i18n.t('message.checkEmailToResetPass', { lang }) };
  }

  async verifyForgotPasswordToken(body: IToken, lang: string) {
    const { token } = body;

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>(
          'CUS_SEND_EMAIL_FORGOT_PW_SECRET',
        ),
      });

      const { customerID } = payload;
      const customer = await this.customerModel.findById(customerID);
      if (!customer || !customer.sendForgotPwExp) {
        throw new RpcException(
          {
            statusCode: 400,
            message: this.i18n.t('error.token_verification_failed', { lang })
          }
        );
      }

      const updateForgotPwToken = this.jwtService.sign(
        { customerID, username: payload.username },
        {
          secret: this.configService.get<string>('CUS_UPDATE_PW_FORGOT_SECRET'),
          expiresIn: '5m',
        },
      );

      await this.customerModel.updateOne(
        { _id: customerID },
        { $set: { forgotPwToken: updateForgotPwToken } },
      );

      return { result: updateForgotPwToken };
    } catch (error) {
      console.log(error);
      throw new RpcException(
        {
          statusCode: 400,
          message: this.i18n.t('error.token_verification_failed', { lang })
        }
      );
    }
  }

  async updatePassword(body: IUpdatePassword, lang: string) {
    const { updatePasswordToken, newPassword } = body;

    try {
      const payload = this.jwtService.verify(updatePasswordToken, {
        secret: this.configService.get<string>('CUS_UPDATE_PW_FORGOT_SECRET'),
      });

      const { customerID } = payload;
      const customer = await this.customerModel.findOne({
        _id: customerID,
        forgotPwToken: updatePasswordToken,
      });

      if (!customer) {
        throw new RpcException({
          statusCode: 400,
          message: this.i18n.t('error.password_update_failed', { lang })
        }
        );
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);

      await this.customerModel.updateOne({ _id: customer._id }, {
        $set: {
          password: hashedPassword,
          forgotPwToken: 0,
          sendForgotPwExp: 0
        }
      });

      return {
        statusCode: 200,
        message: this.i18n.t('error.password_updated_successfully', { lang }),
      };
    } catch (error) {
      console.log(error);
      throw new RpcException(
        {
          statusCode: 500,
          message: this.i18n.t('error.password_update_failed', { lang })
        }
      );
    }
  }

  async refreshToken(body: IRefreshToken, lang: string) {
    const { refreshToken } = body;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('CUS_REFRESH_TOKEN_KEY'),
      });

      const { _id, username, bio } = payload;

      const newAccessToken = this.jwtService.sign(
        { _id, username, bio },
        {
          secret: this.configService.get<string>('CUS_ACCESS_TOKEN_KEY'),
          expiresIn: this.configService.get<string>(
            'CUS_ACCESS_TOKEN_EXPIRES_IN',
          ),
        },
      );

      const newRefreshToken = this.jwtService.sign(
        { _id, username, bio },
        {
          secret: this.configService.get<string>('CUS_REFRESH_TOKEN_KEY'),
          expiresIn: this.configService.get<string>(
            'CUS_REFRESH_TOKEN_EXPIRES_IN',
          ),
        },
      );

      return {
        result: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      console.log(error);
      throw new RpcException(
        {
          statusCode: 500,
          message: this.i18n.t('error.token_refresh_failed', { lang })
        }
      );
    }
  }

  async changePassword(userId: string, body: any, lang: string) {
    const { oldPassword, newPassword } = body;
    const customer = await this.customerModel.findById(userId);
    if (!customer) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('error.userNotFound', { lang })
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      oldPassword,
      customer.password,
    );
    if (!isPasswordValid) {
      throw new RpcException(
        {
          statusCode: 400,
          message: this.i18n.t('error.invalid_old_password', { lang })
        }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedNewPassword = await bcryptjs.hash(newPassword, salt);
    await this.customerModel.updateOne({ _id: userId }, { $set: { password: hashedNewPassword } });

    return {
      statusCode: 200,
      message: this.i18n.t('error.password_changed_successfully', { lang }),
    };
  }

  async deleteUnverifiedAccounts() {
    const sevenDaysAgo = moment().subtract(7, 'days').toDate();
    const unverifiedCustomers = await this.customerModel.find({
      isVerified: false,
      createdAt: { $lt: sevenDaysAgo },
    });

    for (const customer of unverifiedCustomers) {
      await this.indexCustomerEntity(customer, 'delete');
    }

    await this.customerModel.deleteMany({
      isVerified: false,
      createdAt: { $lt: sevenDaysAgo },
    });
  }

  async hasExistBioLink(bioLink: string) {
    const resBio = await firstValueFrom(
      this.bioService.send('find_by_bio_link', bioLink),
    );
    const existingBioLink = resBio.data;
    return !!existingBioLink;
  }

  async loginGoogleService({
    googleId,
    email,
    fullName,
    isVerified,
    avatar,
  }: {
    googleId: string;
    email: string;
    fullName: string;
    isVerified: boolean;
    avatar: any;
  }) {
    const username = email.split('@')[0];
    let user = await this.customerModel.findOne({
      $or: [{ email }, { username }]
    });

    if (user && !user.avatar.url) {
      user.avatar.url = avatar.url
      await user.save()
    }

    if (!user) {
      user = await this.customerModel.create({
        googleId,
        email,
        username,
        fullName,
        isVerified,
        avatar,
      });
    }

    const tokenPayload = { _id: user._id, email, username };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('CUS_ACCESS_TOKEN_KEY'),
      expiresIn: this.configService.get<string>('CUS_ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('CUS_REFRESH_TOKEN_KEY'),
      expiresIn: this.configService.get<string>('CUS_REFRESH_TOKEN_EXPIRES_IN'),
    });

    return {
      result: {
        accessToken,
        refreshToken,
        customer: user,
      },
    };
  }

  async createPasswordService({
    password,
    googleId,
    lang,
  }: {
    password: string;
    googleId: string;
    lang: string;
  }) {
    const user = await this.customerModel.findOne({ googleId });
    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('error.not_found_google_id', { lang }),
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    return {
      statusCode: 200,
      message: this.i18n.t('message.createPasswordSuccess', { lang }),
    };
  }

  async getAccountService(userId: string, lang: string) {
    const user = await this.customerModel
      .findById(userId)
      .select('-createdAt -updatedAt -__v -password');

    if (!user)
      throw new RpcException({
        statusCode: 401,
        message: this.i18n.t('userNotFound', { lang }),
        data: {},
      });
    const bioRes = await firstValueFrom(
      this.bioService.send('find_by_user', userId),
    );

    return {
      result: {
        customer: user,
        bio: bioRes.data,
      },
    };
  }

  async updateCustomerService(data: IUpdateCustomer) {
    console.log(data);
    const customer = await this.customerModel.findById(data.userId).select("-createdAt -updatedAt -__v")
    if (!customer) throw new RpcException({
      statusCode: 404,
      message: this.i18n.t('error.userNotFound', { lang: data.lang })
    })

    Object.assign(customer, {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.avatar && data.avatar.url && { avatar: data.avatar }),
      ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
      ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
      ...(data.gender && { gender: data.gender }),
      ...(data.address && { address: data.address }),
    });

    await customer.save();
    await this.indexCustomerEntity(customer, 'update');

    return {
      result: customer,
      message: this.i18n.t('message.updateAccountSuccess', { lang: data.lang })
    }
  }

  async saveRateService(rates: Record<string, number>) {
    const bulkOps = Object.entries(rates).map(([code, exchangeRate]) => ({
      updateOne: {
        filter: { code },
        update: { $set: { exchangeRate: Number(exchangeRate) } },
        upsert: true
      }
    }));
    const res = await this.rateModel.bulkWrite(bulkOps);
    return {
      result: res
    }
  }

  async getUsersByIdsService(userIds: string[]) {
    const users = await this.customerModel.find(
      { _id: { $in: userIds } },
      {
        _id: 1,
        fullName: 1,
        avatar: 1,
        username: 1,
        isVerified: 1,
        isActive: 1
      }
    );

    return {
      result: users.map(user => ({
        _id: user._id,
        fullName: user.fullName,
        avatar: user.avatar,
        bioLink: user.username,
        isVerified: user.isVerified,
        isActive: user.isActive
      }))
    };
  }

  async updatePlan(userId: string, plan: string) {
    const customer = await this.customerModel.findById(userId)
    if (!customer) return {
      result: null
    }

    const updatedCustomer = await this.customerModel.findByIdAndUpdate(
      userId,
      { $set: { planType: plan } },
      { new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return {
      result: updatedCustomer
    }
  }

  async getProfileSlugService(username: string, lang: string) {
    const customer = await this.customerModel.findOne({ username }).select('-password -createdAt -updatedAt -__v');

    if (!customer) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('error.userNotFound', { lang }),
      });
    }

    const bioRes = await firstValueFrom(
      this.bioService.send('find_by_user', customer._id.toString()),
    );

    return {
      result: {
        customer: customer,
        bio: bioRes.data,
      },
      message: this.i18n.t('message.profileRetrieved', { lang }),
    };
  }

  async updateAddressService(userId: string, address: any, lang: string) {
    const customer = await this.customerModel.findById(userId);
    if (!customer) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('error.userNotFound', { lang })
      });
    }

    customer.address = {
      ...customer.address,
      ...address
    };

    await customer.save();

    return {
      result: customer.address,
      message: this.i18n.t('message.addressUpdateSuccess', { lang })
    };
  }

  async getCustomerPlanService(userId: string, lang: string) {
    const customer = await this.customerModel.findById(userId).select('planType accountExpiryDate');
    if (!customer) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('error.userNotFound', { lang })
      });
    }

    return {
      result: {
        planType: customer.planType,
        accountExpiryDate: customer.accountExpiryDate
      },
      message: this.i18n.t('message.customerPlanRetrieved', { lang })
    };
  }

  async getUserByIdService(userId: string, lang: string) {
    const customer = await this.customerModel.findById(userId);
    if (!customer) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('error.userNotFound', { lang })
      });
    }

    return {
      result: customer,
      message: this.i18n.t('message.customerRetrieved', { lang })
    };
  }
}
