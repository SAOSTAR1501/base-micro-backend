import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe', description: 'The unique bio link for the user' })
  @IsString({ message: 'Biolink must be a string' })
  @IsNotEmpty({ message: 'Biolink is required' })
  @Matches(/^[a-z0-9]+$/, { message: 'Biolink must be alphanumeric' })
  bioLink: string;

  @ApiProperty({ example: 'John Doe', description: 'The full name of the user' })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email address of the user' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password for the user account' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,24}$/, { message: 'Password is invalid format' })
  password: string;
}