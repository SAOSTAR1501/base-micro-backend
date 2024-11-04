import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class BioSearchDto {
    @ApiProperty({
        description: 'bioLink search',
        example: 'hyusense.bio'
    })
    @IsString()
    bioLink: string;

    @ApiProperty({
        description: 'page load more',
        example: 10
    })
    @IsNumber()
    @Type(() => Number)
    page: number;

    @ApiProperty({
        description: 'limit bio',
        example: 10
    })
    @IsNumber()
    @Type(() => Number)
    limit: number;
}
