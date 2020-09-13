import { Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import { AppConfigKey, AppHelper, Environment } from '~/modules/core';
import { MailDataRequired } from '../objects';

@Injectable()
export class EmailService {
  constructor() {
    sendgrid.setApiKey(AppHelper.getConfig(AppConfigKey.SendgridKey));
  }

  public async sendEmail(mail: MailDataRequired) {
    mail = this.prepareEmail(mail);
    await sendgrid.send(mail);
  }

  public sendResetPasswordEmail(email: string, token: string) {
    const mail: MailDataRequired = {
      subject: 'Reset Password',
      to: email,
      from: undefined,
      text: `${AppHelper.getConfig(AppConfigKey.DefaultLink)}/${token}`,
    };

    this.sendEmail(mail);
  }

  private prepareEmail(mail: MailDataRequired) {
    if (AppHelper.checkEnvironment(Environment.Development)) {
      mail.to = AppHelper.getConfig(AppConfigKey.DefaultUsername);
      mail.cc = null;
      mail.bcc = null;
    }

    mail.from = AppHelper.getConfig(AppConfigKey.DefaultEmail);
    return mail;
  }
}
