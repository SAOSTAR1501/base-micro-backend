import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FrontendAuthGuard } from '../guards/frontend-auth.guard';
import { firstValueFrom } from 'rxjs';
import { CheckValidTimeBookingDto, CreateBookingDto, getLangFromRequest, GetStatBookingDto, IUser, PROVIDERS, UpdateBookingStatusDto, User } from '@app/common';
@ApiTags('Customer Booking')
@Controller('frontend-api/bookings')
export class BookingController {
    constructor(
        @Inject(PROVIDERS.BOOKING_SERVICE) private readonly bookingService: ClientProxy,
    ) { }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Create new booking' })
    @Post()
    async createBooking(
        @Body() bookingData: CreateBookingDto,
        @User() user: IUser,
        @Req() req: Request
    ) {
        console.log({ bookingData })
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.bookingService.send('create_booking', {
            body: {
                ...bookingData,
                customerId: user.userId,
            },
            lang
        }));
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Update booking status' })
    @Put('status')
    async updateBookingStatus(
        @User() user: IUser,
        @Body() updateData: UpdateBookingStatusDto,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('update_booking_status', {
                body: {
                    ...updateData,
                    userId: user.userId,
                },
                lang
            })
        );
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Delete booking' })
    @Delete(':bookingId')
    async deleteBooking(
        @User() user: IUser,
        @Param('bookingId') bookingId: string,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('delete_booking', {
                bookingId,
                userId: user.userId,
                lang
            })
        );
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Get booking history' })
    @Get('/history/:bookingId')
    async getBookingHistory(
        @Param('bookingId') bookingId: string,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('get_booking_history', { bookingId, lang })
        );
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Get user bookings' })
    @Get()
    @ApiQuery({ name: 'status', required: false})
    @ApiQuery({ name: 'startDate', required: false})
    @ApiQuery({ name: 'endDate', required: false})
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false})
    async getUserBookings(
        @User() user: IUser,
        @Query('status') status: string = '',
        @Query('startDate') startDate: string = '',
        @Query('endDate') endDate: string = '',
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: Request
    ) {
        console.log({ status, startDate, endDate })
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('get_user_bookings', {
                body: {
                    userId: user.userId,
                    status,
                    startDate,
                    endDate,
                    page,
                    limit,
                },
                lang
            })
        );
    }



    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Get booking details' })
    @Get(':id')
    async getBookingDetails(
        @User() user: IUser,
        @Param('id') bookingId: string,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('get_booking_details', {
                body: {
                    bookingId,
                    userId: user.userId,
                },
                lang
            })
        );
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Get valid transitions status' })
    @Get('/valid-status/:bookingId')
    async getAvailableTransitionsStatus(
        @Param('bookingId') bookingId: string,
        @User() user: IUser,
    ) {
        return await firstValueFrom(
            this.bookingService.send('get_available_status', {
                bookingId,
                userId: user.userId,
            })
        );
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Check valid time booking' })
    @Post('/check-valid-time')
    async checkValidTimeBooking(
        @Body() body: CheckValidTimeBookingDto,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('check_time',
                {
                    body,
                    lang
                }
            )
        );
    }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Get booking customer stats' })
    @Post('/customer-stats')
    async getBookingTimeline(
        @Body() body: GetStatBookingDto,
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('get_customer_booking_stats', {
                body: {
                    customerId: user.userId,
                    ...body
                },
                lang
            })
        );
    }
}