import { getLangFromRequest, PROVIDERS } from "@app/common";
import { Controller, Get, Inject, Param, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from "rxjs";
import { AdminAuthGuard } from "../guards/admin-auth.guard";

@ApiTags('Admin Customer')
@Controller('admin-api/customers')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class AdminCustomerController {
    constructor(
        @Inject(PROVIDERS.CUSTOMER_SERVICE) private readonly customerService: ClientProxy
    ) { }

    @ApiOperation({ summary: 'Get all customers' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @Get()
    async getAllCustomers(
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Query('search') search: string = '',
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        const query = { page, pageSize, search };
        return await firstValueFrom(this.customerService.send('admin_get_all_customers', { query, lang }));
    }

    // @ApiOperation({ summary: 'Update customer' })
    // @ApiParam({ name: 'id', required: true, description: 'Customer ID' })
    // @ApiBody({ type: AdminUpdateCustomerDto })
    // @Put(':id')
    // async updateCustomer(
    //     @Param('id') id: string,
    //     @Body() updateData: AdminUpdateCustomerDto,
    //     @Req() req: Request
    // ) {
    //     const lang = getLangFromRequest(req);
    //     return await firstValueFrom(this.customerService.send('admin_update_customer', { id, updateData, lang }));
    // }

    // @ApiOperation({ summary: 'Delete customer' })
    // @ApiParam({ name: 'id', required: true, description: 'Customer ID' })
    // @Delete(':id')
    // async deleteCustomer(@Param('id') id: string, @Req() req: Request) {
    //     const lang = getLangFromRequest(req);
    //     return await firstValueFrom(this.customerService.send('admin_delete_customer', { id, lang }));
    // }

    @ApiOperation({ summary: 'Block customer' })
    @ApiParam({ name: 'id', required: true, description: 'Customer ID' })
    @Put(':id/block')
    async blockCustomer(@Param('id') id: string, @Req() req: Request) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.customerService.send('admin_block_customer', { id, lang }));
    }

    @ApiOperation({ summary: 'Unblock customer' })
    @ApiParam({ name: 'id', required: true, description: 'Customer ID' })
    @Put(':id/unblock')
    async unblockCustomer(@Param('id') id: string, @Req() req: Request) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.customerService.send('admin_unblock_customer', { id, lang }));
    }
}