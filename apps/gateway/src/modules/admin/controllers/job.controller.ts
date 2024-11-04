import { CreateJobDto, PROVIDERS, UpdateJobDto, getLangFromRequest } from "@app/common";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Observable } from "rxjs";
import { AdminAuthGuard } from "../guards/admin-auth.guard";

@ApiTags('Admin Job')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin-api/job')
export class AdminJobController {
    constructor(
        @Inject(PROVIDERS.JOB_SERVICE) private readonly jobService: ClientProxy
    ) { }
    
    @ApiOperation({ summary: 'Create a new job' })
    @ApiBody({ type: CreateJobDto })
    @Post()
    create(@Body() createJobDto: CreateJobDto, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send('create_job', { body: createJobDto, lang});
    }

    @ApiOperation({ summary: 'Update an existing job' })
    @ApiParam({ name: 'id', type: 'string', description: 'Job ID' })
    @ApiBody({ type: UpdateJobDto })
    @Put(':id')
    update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send('update_job', { body: { id, ...updateJobDto }, lang });
    }

    @ApiOperation({ summary: 'Delete a job' })
    @ApiParam({ name: 'id', type: 'string', description: 'Job ID' })
    @Delete(':id')
    delete(@Param('id') id: string, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send('delete_job', { id, lang });
    }

    @ApiOperation({ summary: 'Get all jobs' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @Get('')
    getAll(@Query() query: any, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send('get_all_job', { query, lang });
    }

    @ApiOperation({ summary: 'Get a job by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'Job ID' })
    @Get(':id')
    getById(@Param('id') id: string, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send('get_job_by_id', { id, lang });
    }
}
