import { getRabbitMQConfig, PROVIDERS, QUEUES } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminBioController } from './controllers/bio-admin.controller';
import { AdminCustomerController } from './controllers/customer.controller';
import { AdminJobController } from './controllers/job.controller';
import { SearchAdminController } from './controllers/search-admin.controller';
import { AdminJwtStrategy } from './guards/admin-jwt-strategy';

const createRabbitMQProvider = (queueName: string, provideName: string) => ({
  provide: provideName,
  useFactory: (configService: ConfigService) => {
    const options = getRabbitMQConfig(configService, queueName);
    return ClientProxyFactory.create(options);
  },
  inject: [ConfigService],
});

@Module({
  imports: [ConfigModule],
  controllers: [
    AdminAuthController,
    AdminBioController,
    AdminCustomerController,
    AdminJobController,
    SearchAdminController,
  ],
  providers: [
    AdminJwtStrategy,
    createRabbitMQProvider(QUEUES.ADMIN_QUEUE, PROVIDERS.ADMIN_SERVICE),
    createRabbitMQProvider(QUEUES.BIO_QUEUE, PROVIDERS.BIO_SERVICE),
    createRabbitMQProvider(QUEUES.CUSTOMER_QUEUE, PROVIDERS.CUSTOMER_SERVICE),
    createRabbitMQProvider(QUEUES.JOB_QUEUE, PROVIDERS.JOB_SERVICE),
    createRabbitMQProvider(QUEUES.SEARCH_QUEUE, PROVIDERS.SEARCH_SERVICE),
  ],
})
export class AdminModule {}