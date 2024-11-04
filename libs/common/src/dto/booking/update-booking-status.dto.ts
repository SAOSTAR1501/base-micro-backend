import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateBookingStatusDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    bookingId: string;

    @ApiProperty({
        description: 'Trạng thái của đơn đặt chỗ',
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
        example: 'pending || confirmed || in_progress || completed || cancelled || no_show'
    })
    @IsNotEmpty()
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

    @ApiProperty({ required: false })
    @IsString()
    reason?: string;
}