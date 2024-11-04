import { BioSearchDto, getLangFromRequest, IUser, PROVIDERS, UpdateBioDto, User } from '@app/common';
import { Body, Controller, Get, Inject, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { firstValueFrom } from 'rxjs';
import { FrontendAuthGuard } from '../guards/frontend-auth.guard';


@ApiTags('Customer Bio')
@Controller('frontend-api/bios')
export class BioController {
    constructor(
        @Inject(PROVIDERS.BIO_SERVICE) private readonly bioService: ClientProxy,
    ) { }

    @ApiOperation({ summary: 'Search bio' })
    @Get('search')
    async getBioSearch(@Query() query: BioSearchDto) {
        return await firstValueFrom(this.bioService.send('search_bio', query))
    }

    @ApiOperation({ summary: 'Get all bio' })
    @Get()
    getAllBio(@Query() query: any) {
        return this.bioService.send('get_all_bio', query);
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Update bio' })
    @Put()
    async updateBio(@User() user: IUser, @Body() body: UpdateBioDto | any, @Req() req: Request) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.bioService.send('update_bio', { userId: user.userId, bioData: body, lang }));
    }

    @ApiOperation({ summary: 'Get detail bio' })
    @Get(':bioLink')
    async getDetailBio(@Param('bioLink') bioLink: string) {
        return await firstValueFrom(this.bioService.send('find_by_bio_link', bioLink));
    }
}
