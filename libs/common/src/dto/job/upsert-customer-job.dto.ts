import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpsertCustomerJobDto {
    @ApiProperty({ description: 'Array of job IDs', example: ['jobId1', 'jobd2'] })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    jobIds: string[];
}