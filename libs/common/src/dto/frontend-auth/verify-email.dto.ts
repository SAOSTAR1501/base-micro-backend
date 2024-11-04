import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'abc123def456', description: 'The token for email verification' })
  @IsString({ message: 'Verify email token must be a string' })
  @IsNotEmpty({ message: 'Verify email token is required' })
  token: string;
}