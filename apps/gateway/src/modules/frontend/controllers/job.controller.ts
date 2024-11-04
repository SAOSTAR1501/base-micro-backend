import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Observable } from "rxjs";
import { FrontendAuthGuard } from '../guards/frontend-auth.guard';
import { CreateServiceDto, getLangFromRequest, IUser, PROVIDERS, Public, UpdateServiceDto, UpsertCustomerJobDto, User } from "@app/common";

@ApiTags('Customer Job')
@UseGuards(FrontendAuthGuard)
@Controller('frontend-api/job')
export class FrontendJobController {
    constructor(
        @Inject(PROVIDERS.JOB_SERVICE) private readonly jobService: ClientProxy
    ) { }
    //Jobs
    @Public()
    @ApiOperation({ summary: "Get all public jobs" })
    @Get("all-by-customer")
    getJobsByCustomer() {
        return this.jobService.send('all_by_customer', {});
    }

    //Customer jobs
    @ApiBearerAuth()
    @ApiOperation({ summary: "Upsert customer's jobs" })
    @Post('upsert-customer')
    upsertCustomerJob(@User() user: IUser, @Body() upsertCustomerJobDto: UpsertCustomerJobDto, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send('upsert_customer_job', { body: { ...upsertCustomerJobDto, seller: { sellerId: user.userId, fullname: user.fullName, username: user.username, avatarUrl: user.avatarUrl } }, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete all customer's jobs" })
    @Delete('customer')
    deleteCustomerJob(@User() user: IUser, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send('delete_customer_job', { customerId: user.userId, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get customer's jobs" })
    @Get('customer')
    getCustomerJobs(@User() user: IUser, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send('get_customer_jobs', { customerId: user.userId, lang });
    }

    //Prices
    // @Post('create-price')
    // createPrice(@Body() body: CreatePriceDto, @Req() req: Request, @User() user: IUser): Observable<any> {
    //     const lang = getLangFromRequest(req);
    //     return this.jobService.send('set_price_job', { ...body, lang, userId: user.userId });
    // }

    // @ApiParam({ name: 'id', type: 'string', description: 'Price id' })
    // @Delete('remove-price/:id')
    // removePrice(@Req() req: Request, @Param('id') id: string, @User() user: IUser): Observable<any> {
    //     const lang = getLangFromRequest(req);
    //     return this.jobService.send('remove_price_job', { id, lang, userId: user.userId });
    // }

    //Services
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new service" })
    @Post('create-service')
    createService(@User() user: IUser, @Body() createServiceDto: CreateServiceDto, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send("create_service", { body: { ...createServiceDto, sellerId: user.userId }, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a service" })
    @Put('update-service')
    updateService(@User() user: IUser, @Body() createServiceDto: UpdateServiceDto, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send("update_service", { body: { ...createServiceDto, sellerId: user.userId }, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get service by jobId and sellerId" })
    @Post("job-seller-services")
    getServiceByJobIđAndSellerId(
        @Body() body: { jobId: string; sellerId: string },
        @Req() req: Request
    ): Observable<any> {
        const lang = getLangFromRequest(req);
        const { jobId, sellerId } = body;
        return this.jobService.send("get_all_services", { query: { jobId, sellerId }, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get service by jobId and sellerId" })
    @Get("job-seller-services/:id")
    getServiceByJobId(
        @Query() query: any,
        @Param("id") id: string,
        @User() user: IUser,
        @Req() req: Request
    ): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send("get_all_services", { query: { ...query, jobId: id, sellerId: user.userId }, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get services by job" })
    @Get("job-services/:id")
    getServicesByJob(@Param("jobId") jobId: string, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send("get_all_services", { query: { jobId }, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Search services" })
    @Get("services")
    searchServices(@Query() query: any, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send("get_all_services", { query, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get service by id" })
    @Get("services/:id")
    getServiceById(@Param("id") id: string, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send("get_service_by_id", { id, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete service by id" })
    @Delete("services/:id")
    deleteServiceById(@User() user: IUser, @Param("id") id: string, @Req() req: Request): Observable<any> {
        const lang = getLangFromRequest(req);
        return this.jobService.send("delete_service", { body: { id, userId: user.userId }, lang });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get pagination by jobId" })
    @Get("job-services-pagination/:id")
    getPagination(@User() user: IUser, @Param("id") id: string, @Query() query: any): Observable<any> {
        query = {
            sellerId: user.userId,
            jobId: id,
            page: 1, // mặc định trang 1
            pageSize: 5, // mặc định số bản ghi trên trang
            ...query,
        };
        return this.jobService.send("get_pagination_by_job_id", { query });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get job from seller" })
    @Get("job-seller/:sellerId")
    getJobBySellerId(@Param("sellerId") sellerId: string,): Observable<any> {
        return this.jobService.send("job_seller", sellerId);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get service from seller" })
    @Get("service-seller/:sellerId")
    getServiceBySellerId(@Param("sellerId") sellerId: string,): Observable<any> {
        return this.jobService.send("service_seller", sellerId);
    }

    @Public()
    @ApiOperation({ summary: "Get all sellers with infinite scroll" })
    @Get("sellers")
    getAllSellers(
        @Query('pageToken') pageToken?: string,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string,
    ): Observable<any> {
        return this.jobService.send('get_all_sellers', {
            pageToken,
            limit: Number(limit) || 10,
            search
        });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get min and max price of seller's services" })
    @Get("service-price-range/:sellerId")
    getServicePriceRange(@Param("sellerId") sellerId: string): Observable<any> {
        return this.jobService.send("get_service_price_range", sellerId);
    }
}