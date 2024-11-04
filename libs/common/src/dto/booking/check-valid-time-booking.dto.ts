import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CheckValidTimeBookingDto {
    @ApiProperty({ required: true , example: '6715d008352d5cfb880aae9d'},)
    @IsNotEmpty({ message: 'Seller id is required' })
    sellerId: string;

    @ApiProperty({ required: true, example:'6720ae494fab9bc124411eae' })
    @IsNotEmpty({ message: 'Service id is required' })
    serviceId: string;

    @ApiProperty({ required: true, example: '2024-11-01'  })
    @IsNotEmpty({ message: 'Date is required'})
    date: Date;

    @ApiProperty({ required: true , example: '10:00' })
    @IsNotEmpty({ message: 'Start time is required' })
    startTime: string;

    @ApiProperty({ required: true , example: '11:00' })
    @IsNotEmpty({ message: 'End time is required' })
    endTime: string;
}