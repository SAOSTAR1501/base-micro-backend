import { getRabbitMQConfig, PROVIDERS, QUEUES } from '@app/common';
import { RateService } from '@app/common/services';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { FrontendAuthController } from './controllers/auth.controller';
import { BioController } from './controllers/bio.controller';
import { BookingSellerController } from './controllers/booking-seller.controller';
import { BookingController } from './controllers/booking.controller';
import { CommentController } from './controllers/comment.controller';
import { CustomerController } from './controllers/customer.controller';
import { FollowController } from './controllers/follow.controller';
import { FrontendJobController } from './controllers/job.controller';
import { LocationController } from './controllers/location.controller';
import { MediaUploadController } from './controllers/media-upload.controller';
import { NotificationController } from './controllers/notification.controller';
import { PaymentController } from './controllers/payment.controller';
import { SearchFrontendController } from './controllers/search-index.controller';
import { WorkingHoursController } from './controllers/working-hours.controller';
import { FacebookStrategy } from './guards/facebook-auth.strategy';
import { CustomerJwtStrategy } from './guards/frontend-jwt-strategy';
import { GoogleStrategy } from './guards/google-auth.strategy';

const createRabbitMQProvider = (queueName: string, provideName: string) => ({
  provide: provideName,
  useFactory: (configService: ConfigService) => {
    const options = getRabbitMQConfig(configService, queueName);
    return ClientProxyFactory.create(options);
  },
  inject: [ConfigService],
});

@Module({
  imports: [
    ConfigModule,
    HttpModule,
  ],
  controllers: [
    FrontendAuthController,
    BioController,
    BookingController,
    BookingSellerController,
    WorkingHoursController,
    CommentController,
    FrontendJobController,
    FollowController,
    LocationController,
    MediaUploadController,
    SearchFrontendController,
    PaymentController,
    CustomerController,
    NotificationController,
  ],
  providers: [
    CustomerJwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    RateService,
    createRabbitMQProvider(QUEUES.CUSTOMER_QUEUE, PROVIDERS.CUSTOMER_SERVICE),
    createRabbitMQProvider(QUEUES.BIO_QUEUE, PROVIDERS.BIO_SERVICE),
    createRabbitMQProvider(QUEUES.BOOKING_QUEUE, PROVIDERS.BOOKING_SERVICE),
    createRabbitMQProvider(QUEUES.COMMENT_QUEUE, PROVIDERS.COMMENT_SERVICE),
    createRabbitMQProvider(QUEUES.JOB_QUEUE, PROVIDERS.JOB_SERVICE),
    createRabbitMQProvider(QUEUES.MEDIA_UPLOAD_QUEUE, PROVIDERS.MEDIA_UPLOAD_SERVICE),
    createRabbitMQProvider(QUEUES.SEARCH_QUEUE, PROVIDERS.SEARCH_SERVICE),
    createRabbitMQProvider(QUEUES.PAYMENT_QUEUE, PROVIDERS.PAYMENT_SERVICE),
    createRabbitMQProvider(QUEUES.NOTIFICATION_QUEUE, PROVIDERS.NOTIFICATION_SERVICE),
    createRabbitMQProvider(QUEUES.WEBSOCKET_QUEUE, PROVIDERS.WEBSOCKET_SERVICE),
  ],
})
export class FrontendModule { }