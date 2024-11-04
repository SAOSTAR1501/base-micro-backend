import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({
        description: 'The bio link associated with the comment',
        example: 'john-doe'
    })
    @IsNotEmpty({ message: 'Bio link is required' })
    bioLink: string;

    @ApiProperty({
        description: 'The rating given in the comment',
        minimum: 1,
        maximum: 5,
        example: 4
    })
    @IsNotEmpty({ message: 'Rating is required' })
    @IsInt({ message: 'Rating must be an integer' })
    @IsNumber({}, { message: 'Rating must be a number' })
    @Min(1, { message: 'Rating must be greater than or equal to 1' })
    @Max(5, { message: 'Rating must be less than or equal to 5' })
    rating: number;

    @ApiProperty({
        description: 'The content of the comment',
        example: 'Great service! Highly recommended.'
    })
    @IsNotEmpty({ message: 'Comment is required' })
    comment: string;
}
