import { ChangePasswordDto, IUser, PROVIDERS, User } from '@app/common';
import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminAuthGuard } from '../guards/admin-auth.guard';

@ApiTags('Admin Authentication')
@Controller('admin-api/admin-auth')
export class AdminAuthController {
  constructor(
    @Inject(PROVIDERS.ADMIN_SERVICE) private readonly authService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Register a new admin' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: 'password123' }
      }
    }
  })
  @Post('register')
  register(@Body() body) {
    return this.authService.send('register-admin', body);
  }

  @ApiOperation({ summary: 'Login admin' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: 'password123' }
      }
    }
  })
  @Post('login')
  login(@Body() body) {
    return this.authService.send('login-admin', body);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  @Post('refresh-token')
  refreshToken(@Body() body) {
    return this.authService.send('refresh-token', body);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Post('change-password')
  changePassword(@Req() req: Request, @Body() body: ChangePasswordDto, @User() user: IUser) {
    const { oldPassword, newPassword } = body;
    
    return this.authService.send(
      'change-password',
      { userId: user.userId, oldPassword, newPassword },
    );
  }
}