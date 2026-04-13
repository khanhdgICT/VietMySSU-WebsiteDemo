import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, TwoFaVerifyDto, RefreshTokenDto } from './dto/auth.dto';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email & password' })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.headers['x-forwarded-for'] as string;
    return this.authService.login(dto, ip);
  }

  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify 2FA code after login' })
  verifyTwoFa(@Req() req: any, @Body() dto: TwoFaVerifyDto) {
    return this.authService.verifyTwoFa(req.user.id, dto);
  }

  @Get('2fa/setup')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get QR code to set up 2FA' })
  setupTwoFa(@Req() req: any) {
    return this.authService.generateTwoFaSecret(req.user.id);
  }

  @Post('2fa/enable')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable 2FA after scanning QR code' })
  enableTwoFa(@Req() req: any, @Body() dto: TwoFaVerifyDto) {
    return this.authService.enableTwoFa(req.user.id, dto.code);
  }

  @Post('2fa/disable')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable 2FA' })
  disableTwoFa(@Req() req: any, @Body() dto: TwoFaVerifyDto) {
    return this.authService.disableTwoFa(req.user.id, dto.code);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@Req() req: any) {
    return req.user;
  }
}
