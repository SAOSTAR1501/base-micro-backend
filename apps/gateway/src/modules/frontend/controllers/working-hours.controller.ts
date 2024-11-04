import { CreateWorkingHoursDto, getLangFromRequest, IUser, PROVIDERS, UpdateUnavailableDatesDto, User } from '@app/common';
import { Body, Controller, Get, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { FrontendAuthGuard } from '../guards/frontend-auth.guard';
@ApiTags('Customer Working Hours')
@Controller('frontend-api/working-hours')
export class WorkingHoursController {
    constructor(
        @Inject(PROVIDERS.BOOKING_SERVICE) private readonly bookingService: ClientProxy
    ) { }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Create working hours' })
    @Post()
    async createWorkingHours(
        @Body() workingHoursData: CreateWorkingHoursDto,
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.bookingService.send('create_working_hours', {
            body: {
                ...workingHoursData,
                sellerId: user.userId
            },
            lang
        }));
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Update working hours' })
    @Put()
    async updateWorkingHours(
        @Body() updateData: CreateWorkingHoursDto,
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.bookingService.send('update_working_hours', {
            body: {
                ...updateData,
                sellerId: user.userId
            },
            lang
        }));
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Get working hours' })
    @Get(':sellerId')
    async getWorkingHours(
        @Param('sellerId') sellerId: string,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.bookingService.send('get_working_hours', {
            sellerId,
            lang
        }));
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Update unavailable dates' })
    @ApiBody({
        type: UpdateUnavailableDatesDto,
        description: 'Dates to be marked as unavailable'
    })
    @Put('unavailable-dates')
    async updateUnavailableDates(
        @Body() updateData: UpdateUnavailableDatesDto,
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.bookingService.send('update_unavailable_dates', {
            body: {
                ...updateData,
                sellerId: user.userId
            },
            lang
        }));
    }
}
