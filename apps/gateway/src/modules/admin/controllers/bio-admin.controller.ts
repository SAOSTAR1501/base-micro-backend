import { getLangFromRequest, PROVIDERS } from "@app/common";
import { Controller, Get, Inject, Param, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from "rxjs";
import { AdminAuthGuard } from "../guards/admin-auth.guard";

@ApiTags('Admin Bio')
@Controller('admin-api/bios')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class AdminBioController {
    constructor(
        @Inject(PROVIDERS.BIO_SERVICE) private readonly bioService: ClientProxy
    ) { }

    @ApiOperation({ summary: 'Get all bios' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @Get()
    async getAllBios(
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Query('search') search: string = '',
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        const query = { page, pageSize, search };
        return await firstValueFrom(this.bioService.send('admin_get_all_bios', { query, lang }));
    }

    @ApiOperation({ summary: 'Get bio by ID' })
    @ApiParam({ name: 'id', required: true, description: 'Bio ID' })
    @Get(':id')
    async getBioById(@Param('id') id: string, @Req() req: Request) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.bioService.send('admin_get_bio_by_id', { id, lang }));
    }

    @ApiOperation({ summary: 'Block bio' })
    @ApiParam({ name: 'id', required: true, description: 'Bio ID' })
    @Put(':id/block')
    async blockBio(@Param('id') id: string, @Req() req: Request) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.bioService.send('admin_block_bio', { id, lang }));
    }

    @ApiOperation({ summary: 'Unblock bio' })
    @ApiParam({ name: 'id', required: true, description: 'Bio ID' })
    @Put(':id/unblock')
    async unblockBio(@Param('id') id: string, @Req() req: Request) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.bioService.send('admin_unblock_bio', { id, lang }));
    }
}