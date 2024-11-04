import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}

export class   UpdateServiceDto {

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty() 
  id: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;    

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString() 
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;    

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(30)
  duration?: number;  

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}