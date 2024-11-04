import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { getLangFromRequest } from '../helper';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    constructor() {}

    async catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();

        const lang = getLangFromRequest(request) || 'vi';
        const translatedMessage = await this.getTranslatedMessage(exceptionResponse, lang);

        response.status(status).json({
            success: false,
            statusCode: status,
            message: translatedMessage,
            error: exceptionResponse.error || 'Bad Request',
        });
    }

    private async getTranslatedMessage(exceptionResponse: any, lang: string): Promise<string> {
        if (typeof exceptionResponse.message === 'string') {
            return this.translateSimpleMessage(exceptionResponse.message, lang);
        }

        if (Array.isArray(exceptionResponse.message)) {
            return this.translateArrayMessage(exceptionResponse.message, lang);
        }

        return 'An unknown error occurred';
    }

    private async translateSimpleMessage(message: string, lang: string): Promise<string> {
        return message;
    }

    private async translateArrayMessage(messages: any[], lang: string): Promise<string> {
        const firstError = messages[0];
        if (firstError && firstError.constraints) {
            return this.translateConstraintMessage(firstError, lang);
        }
        return this.translateSimpleMessage(firstError, lang);
    }

    private async translateConstraintMessage(error: any, lang: string): Promise<string> {
        const firstConstraintKey = Object.keys(error.constraints)[0];
        const firstConstraintMessage = error.constraints[firstConstraintKey];

        return firstConstraintMessage
    }
}