import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;
}