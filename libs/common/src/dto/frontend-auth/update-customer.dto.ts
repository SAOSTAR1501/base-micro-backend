import { IsString, IsOptional, ValidateNested, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

class AvatarDto {
    @IsString()
    url: string;

    @IsString()
    publicId: string;

    @IsString() 
    resourceType: string;
}
 
class WardDto {
    @IsString()
    wardName: string;

    @IsString()
    wardCode: string; 
}

class DistrictDto {
    @IsString()
    districtName: string;

    @IsNumber()
    districtID: number;
}

class ProvinceDto {
    @IsString()
    provinceName: string;
    
    @IsNumber()
    provinceID: number;
}

export class AddressDto {
    @IsOptional()
    @IsString()
    street: string;

    @IsOptional()
    @IsString()
    country: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => WardDto)      // Sử dụng ValidateNested cho ward
    ward: WardDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => DistrictDto)   // Sử dụng ValidateNested cho district
    district: DistrictDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => ProvinceDto)   // Sử dụng ValidateNested cho province
    province: ProvinceDto;
}

export class UpdateCustomerDto {
    @ApiProperty({
        example: "Phan Tiến Huy",
        description: 'Full name',
    })
    @IsOptional()
    @IsString()
    fullName: string;

    @ApiProperty({
        example: { url: 'https://avatar.iran.liara.run/public/24', publicId: 'avatarId' },
        description: 'Avatar info',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => AvatarDto)
    avatar: AvatarDto;

    @ApiProperty({
        example: {
            street: "Hoài Đức",
            country: "Việt Nam",
            ward: {
                wardName: "Hoài Đức Ward",
                wardCode: "HD123"
            },
            district: {
                districtName: "Hoài Đức District",
                districtID: "HD001"
            },
            province: {
                provinceName: "Hà Nội",
                provinceID: "HN001"
            }
        },
        description: 'Address info',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;

    @ApiProperty({
        example: "male",
        description: 'Gender',
    })
    @IsOptional()
    @IsString()
    gender: string;

    @ApiProperty({
        example: "0986538387",
        description: 'Phone',
    })
    @IsOptional()
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        example: "2002-09-21",
        description: 'Date of Birth',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: i18nValidationMessage('validation.updateCustomer.dateOfBirth') })
    dateOfBirth: Date;
}
