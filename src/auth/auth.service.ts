import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { randomBytes } from 'crypto';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (existingUser) {
      throw new BadRequestException(
        'Email already registered',
      );
    }

    const hashedPassword =
      await bcrypt.hash(dto.password, 10);

    const user =
      await this.prisma.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          password: hashedPassword,
        },
      });

    return {
      message: 'Register Success',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      throw new BadRequestException(
        'Invalid Credentials',
      );
    }

    const isMatch =
      await bcrypt.compare(
        dto.password,
        user.password,
      );

    if (!isMatch) {
      throw new BadRequestException(
        'Invalid Credentials',
      );
    }

    const accessToken =
      await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          expiresIn: '15m',
        },
      );

    const refreshToken =
      await this.jwtService.signAsync(
        {
          sub: user.id,
        },
        {
          expiresIn: '7d',
        },
      );

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async refresh(
    dto: RefreshTokenDto,
  ) {
    const payload =
      await this.jwtService.verifyAsync(
        dto.refreshToken,
      );

    const user =
      await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

    if (
      !user ||
      user.refreshToken !==
        dto.refreshToken
    ) {
      throw new BadRequestException(
        'Invalid Refresh Token',
      );
    }

    const accessToken =
      await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
      });

    return {
      accessToken,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });

    return {
      message: 'Logout Success',
    };
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      return {
        message:
          'If account exists, email sent',
      };
    }

    const token =
      randomBytes(32).toString(
        'hex',
      );

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken: token,
        resetTokenExpiry:
          new Date(
            Date.now() +
              1000 * 60 * 15,
          ),
      },
    });

    await this.mailService.sendResetPasswordMail(
      user.email,
      token,
    );

    return {
      message:
        'Reset link sent successfully',
    };
  }

  async resetPassword(
    dto: ResetPasswordDto,
  ) {
    const user =
      await this.prisma.user.findFirst({
        where: {
          resetToken: dto.token,
        },
      });

    if (!user) {
      throw new BadRequestException(
        'Invalid Token',
      );
    }

    if (
      user.resetTokenExpiry &&
      user.resetTokenExpiry <
        new Date()
    ) {
      throw new BadRequestException(
        'Token Expired',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        dto.password,
        10,
      );

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password:
          hashedPassword,

        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      message:
        'Password Reset Success',
    };
  }
}