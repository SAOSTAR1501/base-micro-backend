import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
export class UpdateJobDto {
    @ApiProperty({
        description: 'The name of the job',
        example: 'Senior Software Developer',
        required: false
    })
    @IsString({ message: 'Job name must be a string' })
    @IsNotEmpty({ message: 'Job name is required' })
    name?: string;

    @ApiProperty({
        description: 'The code of the job. Must be uppercase letters and numbers only.',
        example: 'SRSWDEV001',
        required: false
    })
    @IsString({ message: 'Job code must be a string' })
    @IsNotEmpty({ message: 'Job code is required' })
    @Matches(/^[A-Z0-9]+$/, { message: 'Job code is invalid format' })
    code?: string;
}