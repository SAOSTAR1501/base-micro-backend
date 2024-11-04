import { IUser, NotificationUpdateDto, PROVIDERS, User } from '@app/common';
import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { FrontendAuthGuard } from '../guards/frontend-auth.guard';
@ApiTags('Customer notification')
@Controller('frontend-api/notifications')
export class NotificationController {
    constructor(
        @Inject(PROVIDERS.NOTIFICATION_SERVICE) private readonly notificationService: ClientProxy,
    ) { }

    @ApiOperation({ summary: 'Get notifications by user' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Get('')
    async getNotificationByUser(@User() user: IUser) {
        return await firstValueFrom(this.notificationService.send('get_notification_by_user', user.userId))
    }

    @ApiOperation({ summary: 'Update notification' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Put('/:id')
    async updateNotification(@Param('id') _id: string, @Body() body: NotificationUpdateDto) {
        return await firstValueFrom(this.notificationService.send('update_notification', { _id, body }))
    }

    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Post('/mark-all-read')
    async markAllNotificationsAsRead(@User() user: IUser) {
        return await firstValueFrom(this.notificationService.send('mark_all_notifications_as_read', user.userId))
    }

    @ApiOperation({ summary: "Archieve notification" })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Put('/archieve/:id')
    async archieveNotification(@Param('id') notificationId: string, @User() user: IUser) {
        return await firstValueFrom(this.notificationService.send('archieve_notification', { notificationId, userId: user.userId }))
    }

    @ApiOperation({ summary: "Archieve all notifications" })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Post('/archieve-all')
    async archieveAllNotifications(@User() user: IUser) {
        return await firstValueFrom(this.notificationService.send('archieve_all_notifications', { userId: user.userId }))
    }

    @ApiOperation({ summary: "Get all archived notifications" })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Get('/archieve')
    async getAllArchivedNotifications(@User() user: IUser) {
        return await firstValueFrom(this.notificationService.send('get_all_archieved_notifications', user.userId))
    }

    @ApiOperation({ summary: "Unarrchieve 1 notification" })
    @ApiBearerAuth()
    @UseGuards(FrontendAuthGuard)
    @Put('/unarchieve/:id')
    async unArchivedNotification(@Param('id') notificationId: string, @User() user: IUser) {
        return await firstValueFrom(this.notificationService.send('unarchieve_notification', { notificationId, userId: user.userId }))
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Unarrchieve all notifications" })
    @UseGuards(FrontendAuthGuard)
    @Post('/unarchieve-all')
    async unArchivedAllNotifications(@User() user: IUser) {
        return await firstValueFrom(this.notificationService.send('unarchieve_all_notifications', user.userId))
    }
}
