import { ConfigService } from '@nestjs/config';
import { Transport, RmqOptions } from '@nestjs/microservices';

export const getRabbitMQConfig = (configService: ConfigService, queueName: string): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
        urls: [configService.get<string>('RABBITMQ_URL')],
        queue: queueName,
        queueOptions: {
            durable: true,
        },
    },
});
