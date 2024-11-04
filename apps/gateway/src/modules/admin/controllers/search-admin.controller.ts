import { PROVIDERS } from "@app/common";
import { Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy, Payload } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Admin Search')
@Controller('admin-api/search')
export class SearchAdminController {
    constructor(
        @Inject(PROVIDERS.SEARCH_SERVICE) private readonly searchService: ClientProxy,
    ) { }

    @Post('add-index')
    async indexEntity(@Payload() data: { entity: any; entityType: string; operation: string }) {
        return this.searchService.send('index_entity', data);
    }

    @Post()
    async search(@Payload() data: { query: string; filters: any; userId: string }) {
        return this.searchService.send('search', data);
    }

    @Post('update-score')
    async updateSearchScore(@Payload() data: { entityId: string; score: number }) {
        return this.searchService.send('update_search_score', data);
    }
}