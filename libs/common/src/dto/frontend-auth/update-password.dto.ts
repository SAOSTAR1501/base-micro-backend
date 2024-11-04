import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'abc123def456', description: 'The token for updating password' })
  @IsString({ message: 'Update password token must be a string' })
  @IsNotEmpty({ message: 'Update password token is required' })
  updatePasswordToken: string;

  @ApiProperty({ example: 'newPassword123', description: 'The new password' })
  @IsString({ message: 'newPassword must be a string' })
  @IsNotEmpty({ message: 'newPassword is required' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,24}$/, { message: 'newPassword is invalid format' })
  newPassword: string;
}