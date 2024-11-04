import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { FrontendAuthGuard } from "../guards/frontend-auth.guard";
import { getLangFromRequest, GetSellerMonthlyStatDto, GetStatBookingDto, IUser, PROVIDERS, User } from "@app/common";

@ApiTags('Seller Booking')
@UseGuards(FrontendAuthGuard)
@Controller('frontend-api/seller-booking')
export class BookingSellerController {
    constructor(
        @Inject(PROVIDERS.BOOKING_SERVICE) private readonly bookingService: ClientProxy,
    ) { }

    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @ApiOperation({ summary: 'Get seller bookings' })
    @Get('')
    @ApiQuery({ name: 'status', required: false})
    @ApiQuery({ name: 'startDate', required: false})
    @ApiQuery({ name: 'endDate', required: false})
    @ApiQuery({ name: 'page', required: false})
    @ApiQuery({ name: 'limit', required: false})
    async getSellerBookings(
        @User() user: IUser,
        @Query('status') status: string = '',
        @Query('startDate') startDate: string = '',
        @Query('endDate') endDate: string = '',
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('get_seller_bookings', {
                body: {
                    sellerId: user.userId,
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
    @ApiOperation({ summary: 'Get seller booking stats' })
    @Post('stats')
    async getSellerBookingStats(
        @Body() body: GetStatBookingDto,
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('get_seller_booking_stats', {
                body: {
                    sellerId: user.userId,
                    ...body
                },
                lang
            })
        );
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get seller monthly stats' })
    @Post('monthly-stats')
    async getSellerMonthlyStats(
        @Body() body: GetSellerMonthlyStatDto,
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(
            this.bookingService.send('get_seller_monthly_stats', {
                body: {
                    sellerId: user.userId,
                    ...body
                }
            }
            ));
    }
}