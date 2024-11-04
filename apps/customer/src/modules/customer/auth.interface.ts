export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IForgotPassword {
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRefreshToken {
  refreshToken: string;
}

export interface IRegister {
  bioLink: string;
  fullName: string;
  email: string;
  password: string;
}

export interface IUpdatePassword {
  updatePasswordToken: string;
  newPassword: string;
}

export interface IToken {
  token: string;
}

export interface IToken {
  token: string;
  oldPassword: string;
  newPassword: string;
}

export interface IForgotPassword {
  email: string;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface IRefreshToken {
  refreshToken: string;
}

export interface IRegister {
  bioLink: string;
  fullName: string;
  email: string;
  password: string;
}

export interface IUpdatePassword {
  updatePasswordToken: string;
  newPassword: string;
}

export interface IToken {
  token: string;
}

export interface IToken {
  token: string;
}

export interface IAvatar {
  url: string;
  publicId: string;
}

export interface IWard {
  wardName: string;
  wardCode: string;
}

export interface IDistrict {
  districtName: string;
  districtID: string;
}

export interface IProvince {
  provinceName: string;
  provinceID: string;
}

export interface IAddress {
  street: string;
  country: string;
  ward: IWard;
  district: IDistrict;
  province: IProvince;
}

export interface IUpdateCustomer {
  userId: string;
  fullName?: string;
  password?: string;
  newPassword?: string;
  lang: string;
  avatar?: IAvatar;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address: IAddress
}
