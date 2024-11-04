import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GetStatBookingDto {
    @ApiProperty()
    @IsOptional()
    startDate: Date;

    @ApiProperty()
    @IsOptional()
    endDate: Date;
}

export class GetSellerMonthlyStatDto {
    @ApiProperty()
    @IsOptional()
    year: number;

    @ApiProperty()
    @IsOptional()
    month: number;
}