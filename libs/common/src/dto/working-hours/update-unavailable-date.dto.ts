import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class UpdateUnavailableDatesDto {
    @ApiProperty({
        type: [Date],
        description: 'Array of dates to be marked as unavailable',
        example: ["2024-10-05", "2024-10-12", "2024-10-20", "2024-10-25"]
    })
    @IsArray()
    dates: Date[];
}