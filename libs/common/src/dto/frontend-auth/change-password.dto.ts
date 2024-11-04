import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'The current password' })
  @IsString({ message: 'oldPassword must be a string' })
  @IsNotEmpty({ message: 'oldPassword is required' })
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123', description: 'The new password' })
  @IsString({ message: 'newPassword must be a string' })
  @IsNotEmpty({ message: 'newPassword is required' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,24}$/, { message: 'newPassword is invalid format' })
  newPassword: string;
}

export class CreatePassword {
  @ApiProperty({ example: 'newPassword', description: 'The new password' })
  @IsNotEmpty({ message: 'newPassword is required' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,24}$/, { message: 'newPassword is invalid format' })
  password: string

  @ApiProperty({ example: '121jJHJGHJNBGFt677576', description: 'googleId is saved google login' })
  @IsNotEmpty({ message: 'googleId is required' })
  googleId: string
}