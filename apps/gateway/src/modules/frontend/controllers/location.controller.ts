import { Public } from '@app/common';
import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom } from 'rxjs';

@Controller('locations')
@ApiTags('Public Locations')
@Public()
export class LocationController {
    private readonly token: string;
    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {

        this.token = this.configService.get<string>('TOKEN_ADDRESS_GHN');
    }
    // API lấy danh sách tỉnh
    @Get('provinces')
    async getProvinces() {
        const response = await lastValueFrom(
            this.httpService.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                headers: {
                    token: this.token,
                },
            }),
        );

        // Lọc dữ liệu để chỉ lấy ProvinceID và ProvinceName
        const provinces = response.data.data.map((province) => ({
            ProvinceID: province.ProvinceID,
            ProvinceName: province.ProvinceName,
        }));

        return provinces;
    }

    // API lấy danh sách huyện theo tỉnh
    @Get('districts')
    async getDistricts(@Query('province_id') provinceId: number) {
        const response = await lastValueFrom(this.httpService.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
            {
                headers: {
                    token: this.token,
                },
            }
        ));
        const districts = response.data.data.map((district) => ({
            DistrictID: district.DistrictID,
            DistrictName: district.DistrictName,
        }))
        return districts;
    }

    // API lấy danh sách xã theo huyện
    @Get('wards')
    async getWards(@Query('district_id') districtId: number) {
        const response = await lastValueFrom(this.httpService.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
            {
                headers: {
                    token: this.token,
                },
            }
        )); 

        const wards = response.data.data.map((ward) => ({
            WardCode: ward.WardCode,
            WardName: ward.WardName,
        }))
        return wards;
    }
}