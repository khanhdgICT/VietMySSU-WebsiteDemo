import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './jwt.strategy';
import { AuditService } from '../audit/audit.service';
import { LoginDto, TwoFaVerifyDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
      select: [
        'id',
        'email',
        'fullName',
        'password',
        'status',
        'isTwoFaEnabled',
        'role',
      ],
      relations: ['role'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'active')
      throw new UnauthorizedException('Account is not active');

    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    await this.usersRepository.update(user.id, { lastLoginAt: new Date() });

    await this.auditService.log({
      userId: user.id,
      action: 'LOGIN',
      resource: 'auth',
      ipAddress,
      description: `User ${user.email} logged in`,
    });

    if (user.isTwoFaEnabled) {
      return {
        requiresTwoFa: true,
        tempToken: this.generateTempToken(user),
      };
    }

    return this.generateTokens(user);
  }

  async verifyTwoFa(userId: string, dto: TwoFaVerifyDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'twoFaSecret', 'role'],
      relations: ['role'],
    });

    if (!user?.twoFaSecret) throw new BadRequestException('2FA not set up');

    const isValid = authenticator.verify({
      token: dto.code,
      secret: user.twoFaSecret,
    });

    if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

    return this.generateTokens(user, true);
  }

  async generateTwoFaSecret(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const secret = authenticator.generateSecret();
    const appName = this.configService.get('twoFa.appName');
    const otpAuthUrl = authenticator.keyuri(user.email, appName, secret);
    const qrCode = await QRCode.toDataURL(otpAuthUrl);

    await this.usersRepository.update(userId, { twoFaSecret: secret });

    return { secret, qrCode };
  }

  async enableTwoFa(userId: string, code: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'twoFaSecret'],
    });

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFaSecret,
    });

    if (!isValid) throw new BadRequestException('Invalid verification code');

    await this.usersRepository.update(userId, { isTwoFaEnabled: true });
    return { message: '2FA enabled successfully' };
  }

  async disableTwoFa(userId: string, code: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'twoFaSecret'],
    });

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFaSecret,
    });

    if (!isValid) throw new BadRequestException('Invalid verification code');

    await this.usersRepository.update(userId, {
      isTwoFaEnabled: false,
      twoFaSecret: null,
    });
    return { message: '2FA disabled successfully' };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub, refreshToken },
        relations: ['role'],
      });

      if (!user) throw new UnauthorizedException('Invalid refresh token');

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersRepository.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }

  private generateTempToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'temp_2fa' },
      { expiresIn: '5m' },
    );
  }

  private async generateTokens(user: User, isTwoFaAuthenticated = false) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleId: user.role?.id,
      roleName: user.role?.name,
      isTwoFaAuthenticated,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      },
    );

    await this.usersRepository.update(user.id, { refreshToken });

    return { accessToken, refreshToken, user: this.sanitizeUser(user) };
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role,
      isTwoFaEnabled: user.isTwoFaEnabled,
    };
  }
}
