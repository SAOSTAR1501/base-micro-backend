import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'The refresh token' })
  @IsString({ message: i18nValidationMessage('validation.auth.refreshToken.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.auth.refreshToken.isNotEmpty') })
  refreshToken: string;
}