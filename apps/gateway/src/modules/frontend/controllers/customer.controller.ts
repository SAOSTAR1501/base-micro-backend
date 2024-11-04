import { Body, Controller, Get, Inject, Param, Put, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from "rxjs";
import { FrontendAuthGuard } from '../guards/frontend-auth.guard';
import { getLangFromRequest, IUser, PROVIDERS, UpdateAddressDto, UpdateCustomerDto, User } from "@app/common";

@ApiTags('Customer Account')
@Controller('frontend-api/account')
export class CustomerController {
    constructor(
        @Inject(PROVIDERS.CUSTOMER_SERVICE) private readonly customerService: ClientProxy
    ) { }

    @Get('current')
    @UseGuards(FrontendAuthGuard)
    async getCurrentUserAccount(@User() user: IUser, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerService.send('get_account', { userId: user.userId, lang }))
    }

    @ApiOperation({ summary: 'Get user account information' })
    @ApiParam({ name: 'username', required: true, description: 'Username' })
    @Get('profile/:username')
    async getAccount(@Param('username') username: string, @Req() req: Request) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.customerService.send('get_profile_slug', { username: username, lang }));
    }

    @ApiOperation({ summary: 'Update user address' })
    @ApiBearerAuth()
    @ApiBody({ type: UpdateAddressDto })
    @UseGuards(FrontendAuthGuard)
    @Put('update-address')
    async updateAddress(
        @Body() body: UpdateAddressDto,
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.customerService.send('update_address', { userId: user.userId, address: body, lang }));
    }

    @ApiOperation({ summary: 'Get customer plan information' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Get('plan')
    async getCustomerPlan(@User() user: IUser, @Req() req: Request) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.customerService.send('get_customer_plan', { userId: user.userId, lang }));
    }

    @ApiOperation({ summary: 'Update customer account' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Put('update')
    async updateAccount(
        @Body() body: UpdateCustomerDto,
        @User() user: IUser,
        @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.customerService.send('update_customer', { ...body, userId: user.userId, lang })) 
    }
}