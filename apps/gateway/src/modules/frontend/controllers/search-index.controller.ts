import { IUser, PROVIDERS, User } from "@app/common";
import { Body, Controller, Get, Inject, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { FrontendAuthGuard } from "../guards/frontend-auth.guard";

@ApiTags('Customer Search')
@UseGuards(FrontendAuthGuard)
@Controller('frontend-api/search')
export class SearchFrontendController {
    constructor(
        @Inject(PROVIDERS.SEARCH_SERVICE) private readonly searchService: ClientProxy,
    ) { }
    @Post()
    async search(
        @Body() data: { query: string; filters: any; page: number; pageSize: number },
        @User() user: IUser
    ): Promise<any> {
        const searchData = {
            ...data,
            userId: user.userId
        };

        const result = await firstValueFrom(this.searchService.send('search', searchData));
        return result;
    }

    @Get('history')
    async getHistorySearch(@User() user: IUser) {
        return this.searchService.send('get_search_logs', { userId: user.userId })
    }

    @Post('modal')
    async searchModal(
        @Body() data: { query: string; limit: number },
        @User() user: IUser
    ): Promise<any> {
        const searchData = {
            ...data,
            userId: user.userId
        };

        const result = await firstValueFrom(this.searchService.send('search_modal', searchData));
        return result;
    }

    @Get('hot-records')
    async getHotRecords(
        @Query('entityType') entityType: string,
        @Query('limit') limit: number
    ): Promise<any> {
        const result = await firstValueFrom(this.searchService.send('get_hot_records', { entityType, limit }));
        return result;
    }

    @ApiBearerAuth()
    @Get('trending-searches')
    async getTrendingSearches(
        @Query('limit') limit: number
    ): Promise<any> {
        const result = await firstValueFrom(this.searchService.send('get_trending_searches', { limit }));
        return result;
    }

    @Get('hot-tags')
    async getHotTags(
        @Query('limit') limit: number
    ): Promise<any> {
        const result = await firstValueFrom(this.searchService.send('get_hot_tags', { limit }));
        return result;
    }

    @Post('update-score-naturally')
    async updateScoreNaturally(@Body() data: { entityId: string, score: number }) {
        data.score = 1;
        const result = await firstValueFrom(this.searchService.send('update_search_score', data));
        return result;
    }
}   