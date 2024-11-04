import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBookingDto {
    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'Seller id is required' })
    sellerId: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'Service id is required' })
    serviceId: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'Booking date is required' })
    bookingDate: Date;

    @ApiProperty({ required: true, description: 'Format: HH:mm' })
    @IsNotEmpty({ message: 'Start time is required' })
    startTime: string;

    @ApiProperty({ required: true, description: 'Format: HH:mm' })
    @IsNotEmpty({ message: 'End time is required' })
    endTime: string;

    @ApiProperty({ required: false })
    @IsString({ message: 'Notes must be a string' })
    notes?: string;
}
  