import { IUser, PROVIDERS, User } from "@app/common";
import { Body, Controller, Get, Inject, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";
import { firstValueFrom, timeout } from "rxjs";
import { FrontendAuthGuard } from "../guards/frontend-auth.guard";

@ApiTags('Customer Payment plan')
@Controller('frontend-api/payment')
export class PaymentController {
    constructor(@Inject(PROVIDERS.PAYMENT_SERVICE) private readonly paymentService: ClientProxy) { }

    @UseGuards(FrontendAuthGuard)
    @Get('stripe')
    async getPaymentStripe(@Query('plan') plan: string, @Res() res: any, @User() user: IUser) {
        const resPayment = await firstValueFrom(this.paymentService.send('subcription_payment_stripe', { plan, userId: user.userId, fullName: user.fullName }))
        console.log('Stripe payment url:', resPayment.data.url);
        return res.redirect(resPayment.data.url)
    }

    @UseGuards(FrontendAuthGuard)
    @Get('stripe-bill/:customerId')
    async getBillCustomer(@Param('customerId') customerId: string, @Res() res: any) {
        const portalSession = await firstValueFrom(this.paymentService.send('get_bill_subcription', customerId))
        return res.redirect(portalSession.data.url)
    }

    @Post('webhook-stripe')
    async listenWebhookStripe(@Req() req: Request, @Res() res: any, @Body() body: Buffer) {
        const sig = req.headers['stripe-signature'] as string;
        await firstValueFrom(
            this.paymentService.send('listen_webhook_stripe', { body: body.toString(), sig }).pipe(
                timeout(5000)
            )
        );
        res.sendStatus(200);
    }

}