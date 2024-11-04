import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

class SlotDto {
    @ApiProperty({description: 'The start time of the slot'})
    @IsNotEmpty()
    @IsString()
    startTime: string;  // "HH:mm" format

    @ApiProperty({description: 'The end time of the slot'})
    @IsNotEmpty()
    @IsString()
    endTime: string;    // "HH:mm" format
}
class ScheduleDto {
    @ApiProperty({description: 'The day of the week'})
    @IsNotEmpty()
    @IsEnum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    
    @ApiProperty({description: 'Whether the day is available'})
    @IsNotEmpty()
    isAvailable: boolean;
    
    @ApiProperty({description: 'Slots of working hours', type: [SlotDto]})
    @IsArray()
    @IsNotEmpty({ each: true })  // Đảm bảo rằng mảng không rỗng
    slots: SlotDto[];
}


export class CreateWorkingHoursDto {
    @ApiProperty({description: 'Schedule of working hours', type: [ScheduleDto]})
    @IsArray()
    @IsNotEmpty({ each: true })  // Đảm bảo rằng mảng không rỗng
    schedule: ScheduleDto[];
}
