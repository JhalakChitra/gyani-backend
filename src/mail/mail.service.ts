import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendResetPasswordMail(
    email: string,
    token: string,
  ) {
    console.log('EMAIL:', email);
    console.log('TOKEN:', token);
  }
}