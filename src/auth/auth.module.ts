import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PrismaModule } from '../prisma/prisma.module';

import { JwtStrategy } from './strategies/jwt.strategy';

import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PrismaModule,

    MailModule,

    JwtModule.register({
      secret:
        process.env.JWT_SECRET,

      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}