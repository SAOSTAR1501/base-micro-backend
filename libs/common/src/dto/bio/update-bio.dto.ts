import {Type} from "class-transformer";
import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsNumber, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AvatarDto {
    @ApiPropertyOptional({ description: 'URL of the avatar' })
    @IsOptional()
    @IsString()
    url: string;

    @ApiPropertyOptional({ description: 'Public ID of the avatar' })
    @IsOptional()
    @IsString()
    publicId: string;
}

class SocialMediaDto {
    @ApiProperty({ description: 'Social media platform' })
    @IsString()
    platform: string;

    @ApiProperty({ description: 'Description of the social media link' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'URL of the social media profile' })
    @IsString()
    link: string;
}

class InforDto {
    @ApiProperty({ description: 'Title of the information' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Content of the information' })
    @IsString()
    content: string;
}

class ImageInfoDto {
    @ApiProperty({ description: 'Index of the image' })
    @IsNumber()
    index: number;

    @ApiProperty({ description: 'Description of the image' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'URL of the image' })
    @IsString()
    url: string;

    @ApiProperty({ description: 'Click link for the image' })
    @IsString()
    clickLink: string;

    @ApiPropertyOptional({ description: 'Public ID of the image' })
    @IsOptional()
    @IsString()
    publicId: string;
}

class MediaWidgetDto {
    @ApiProperty({ description: 'Index of the media widget' })
    @IsNumber()
    index: number;

    @ApiProperty({ description: 'Type of the media widget', enum: ['grid', 'slider', 'list', 'banner'] })
    @IsEnum(['grid', 'slider', 'list', 'banner'])
    type: 'grid' | 'slider' | 'list' | 'banner';

    @ApiProperty({ description: 'Title of the media widget' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Array of image information', type: [ImageInfoDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageInfoDto)
    imageInfos: ImageInfoDto[];
}

class TabDto {
    @ApiProperty({ description: 'Index of the tab' })
    @IsNumber()
    index: number;

    @ApiProperty({ description: 'Title of the tab' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Content of the tab' })
    @IsString()
    content: string;
}

export class UpdateBioDto {
    @ApiPropertyOptional({ description: 'Full name of the user' })
    @IsOptional()
    @IsString()
    fullName: string;

    @ApiPropertyOptional({ description: 'Avatar information', type: AvatarDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => AvatarDto)
    avatar: AvatarDto;

    @ApiPropertyOptional({ description: 'Job ID' })
    @IsOptional()
    @IsString()
    jobId: string;

    @ApiPropertyOptional({ description: 'Job title' })
    @IsOptional()
    @IsString()
    jobTitle: string;

    @ApiPropertyOptional({ description: 'User description' })
    @IsOptional()
    @IsString()
    description: string;

    @ApiPropertyOptional({ description: 'Array of social media information', type: [SocialMediaDto] })
    @IsOptional()
    @ValidateIf((o) => o.socialMedias && o.socialMedias.length > 0)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SocialMediaDto)
    socialMedias: SocialMediaDto[];

    @ApiPropertyOptional({ description: 'Array of additional information', type: [InforDto] })
    @IsOptional()
    @ValidateIf((o) => o.infors && o.infors.length > 0)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InforDto)
    infors: InforDto[];

    @ApiPropertyOptional({ description: 'Array of tags', minItems: 1, maxItems: 5 })
    @IsOptional()
    @ValidateIf((o) => o.tags && o.tags.length > 0)
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @ApiPropertyOptional({ description: 'Instruction video information', type: AvatarDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => AvatarDto)
    instructionVideo: AvatarDto;

    @ApiPropertyOptional({ description: 'Array of media widgets', type: [MediaWidgetDto] })
    @IsOptional()
    @ValidateIf((o) => o.mediaWidgets && o.mediaWidgets.length > 0)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MediaWidgetDto)
    mediaWidgets: MediaWidgetDto[];

    @ApiPropertyOptional({ description: 'Array of tabs', type: [TabDto] })
    @IsOptional()
    @ValidateIf((o) => o.tabs && o.tabs.length > 0)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TabDto)
    tabs: TabDto[];
}