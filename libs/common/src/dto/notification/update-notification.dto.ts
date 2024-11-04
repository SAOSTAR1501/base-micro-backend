import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class NotificationUpdateDto {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsObject()
    @IsNotEmpty()
    title?: {
        vi: string;
        en: string;
    };

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsObject()
    @IsNotEmpty()
    content?: {
        vi: string;
        en: string;
    };

    @IsOptional()
    @IsBoolean()
    isRead?: boolean;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}
