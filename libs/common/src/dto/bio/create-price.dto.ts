import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePriceDto {
    @ApiProperty({
        description: 'Job id',
        example: '66fe1b493685d250c802e0d5'
    })
    @IsMongoId({ message: "Invalid 'jobId'" })
    @IsString({ message: 'JobId must be a string' })
    @IsNotEmpty({ message: 'JobId is required' })
    jobId: string;

    @ApiProperty({
        description: 'Min price job',
        example: '100.000.000'
    })
    @IsNotEmpty({ message: 'Min price is required' })
    @IsNumber({}, { message: 'Min price must be a number' })
    @Min(1, { message: 'Min price must be greater than 0' })
    minPrice: number;

    @ApiProperty({
        description: 'Max price job',
        example: '300.000.000'
    })
    @IsNotEmpty({ message: 'Max price is required' })
    @IsNumber({}, { message: 'Max price must be a number' })
    @Min(1, { message: 'Max price must be greater than 0' })
    maxPrice: number;
}
