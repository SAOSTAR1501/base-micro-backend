import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com', description: 'The email address for password reset' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}