import { Body, Controller, Get, Inject, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { FrontendAuthGuard } from '../guards/frontend-auth.guard';
import { CreateCommentDto, getLangFromRequest, IUser, PROVIDERS, User } from '@app/common';
const GetComment = (summary: string) => (
    target: any,
    key: string,
    descriptor: PropertyDescriptor
) => {
    ApiOperation({ summary })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiParam({ name: 'bioLink', description: 'The bio link to fetch comments for' })(target, key, descriptor);
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })(target, key, descriptor);
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })(target, key, descriptor);
    UseGuards(FrontendAuthGuard)(target, key, descriptor);
    return descriptor;
};

@ApiTags('Customer Comment')
@Controller('frontend-api/comments')
export class CommentController {
    constructor(
        @Inject(PROVIDERS.COMMENT_SERVICE) private readonly commentService: ClientProxy,
    ) { }

    @ApiOperation({ summary: 'Create a new comment' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Post()
    async createComment(@Body() body: CreateCommentDto, @Req() req: Request, @User() user: IUser) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.commentService.send('create_comment', { body, lang, user }))
    }

    @Get(':bioLink')
    @GetComment('Get comments by bio link')
    async getCommentsByBioLink(
        @Param('bioLink') bioLink: string,
        @Query() query: { page?: number, pagSize?: number },
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.commentService.send('get_comment_by_bio_link', { bioLink, lang, query, user }))
    }

    @ApiOperation({ summary: 'Calculate bio rates' })
    @ApiParam({
        name: 'bioLink',
        description: 'The link of the bio to calculate rates',
        example: 'hyusense.bio',
    })
    @Get('calculate-rate/:bioLink')
    async calculateRates(@Param('bioLink') bioLink: string, @Req() req: Request) {
        const lang = getLangFromRequest(req)
        return await firstValueFrom(this.commentService.send('calculate_rate', { bioLink, lang }))
    }
}