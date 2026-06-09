import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {

    // CHECK USER EXISTS
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'User already registered',
      );
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    // CREATE USER
    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
      },
    });

    return {
      message: 'Register Success',
      data: user,
    };
  }

  async login(dto: LoginDto) {
    return {
      message: 'Login Success',
      data: dto,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    return {
      message: 'Reset link sent',
      data: dto,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    return {
      message: 'Password reset success',
      data: dto,
    };
  }
}