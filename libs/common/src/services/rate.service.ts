import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { PROVIDERS } from '../config';

@Injectable()
export class RateService {
    constructor(
        private readonly httpService: HttpService,
        @Inject(PROVIDERS.CUSTOMER_SERVICE) private readonly customerService: ClientProxy
    ) { }

    @Cron('0 0 0 * * *', {
        timeZone: 'Asia/Ho_Chi_Minh',
    })
    async updateRate() {
        const options = {
            method: "GET",
            url: "https://exchange-rate-api1.p.rapidapi.com/latest",
            params: { base: "VND" },
            headers: {
                "X-RapidAPI-Key":
                    "701034935dmshefcb89a6a01c8d0p1de1d2jsn4273dab997f9",
                "X-RapidAPI-Host": "exchange-rate-api1.p.rapidapi.com",
            },
        };

        const { data } = await firstValueFrom(this.httpService.request(options));
        if (data.msg !== 'success' || !data.rates) {
            console.log('💥An error occurred while retrieving rate information💥');
            return
        }

        console.log('📈Update rate now📈');
        return await firstValueFrom(this.customerService.send('save_rate', { rates: data.rates }))
    }
}