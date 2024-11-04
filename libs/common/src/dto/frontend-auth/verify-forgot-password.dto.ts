import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyForgotPasswordDto {
  @ApiProperty({ example: 'abc123def456', description: 'The token for forgot password verification' })
  @IsString({ message: 'Verify forgot password token must be a string' })
  @IsNotEmpty({ message: 'Verify forgot password token is required' })
  token: string;
}