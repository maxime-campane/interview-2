import { Injectable, Logger } from '@nestjs/common';

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

@Injectable()
export class FakeEmailService {
  private readonly logger = new Logger(FakeEmailService.name);

  async sendEmail(message: EmailMessage): Promise<void> {
    this.logger.log({
      type: 'email.simulated',
      recipientDomain: message.to.split('@')[1].toLowerCase(),
      subject: message.subject,
    });
  }
}
