import { Controller, Inject, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FrontendAuthGuard } from '../guards/frontend-auth.guard';
import { firstValueFrom } from 'rxjs';
import { getLangFromRequest, IUser, PROVIDERS, User } from '@app/common';


@ApiTags('Customer Follow')
@Controller('frontend-api/')
export class FollowController {
    constructor(
        @Inject(PROVIDERS.CUSTOMER_SERVICE) private readonly customerService: ClientProxy,
    ) { }

    @ApiOperation({ summary: 'Follow a user' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Post('follow/:userId')
    async followUser(
        @Param('userId') userId: string,
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.customerService.send('follow', { body: { userId: user.userId, followerId: userId }, lang }));
    }

    @ApiOperation({ summary: 'Unfollow a user' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Post('unfollow/:userId')
    async unfollowUser(
        @Param('userId') userId: string,
        @User() user: IUser,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);
        return await firstValueFrom(this.customerService.send('unfollow', { body: { userId: user.userId, followerId: userId }, lang }));
    }

    @ApiOperation({ summary: 'Get list of followers' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Post('/followers')
    async getFollowers(
        @User() user: IUser,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);


        return await firstValueFrom(this.customerService.send('get_followers', {
            body: {
                userId: user.userId,
                page,
                limit,
            }, lang
        }));
    }

    @ApiOperation({ summary: 'Get list of users following' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Post('/following')
    async getFollowing(
        @User() user: IUser,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Req() req: Request
    ) {
        const lang = getLangFromRequest(req);

        return await firstValueFrom(this.customerService.send('get_following', {
            body: {
                userId: user.userId,
                page,
                limit,
            }, lang
        }));
    }
}
