export type EmailData = string | { name?: string; email: string };

export interface AttachmentData {
  content: string;
  filename: string;
  type?: string;
  disposition?: string;
  contentId?: string;
}

export class MailData {
  to?: EmailData | EmailData[];
  cc?: EmailData | EmailData[];
  bcc?: EmailData | EmailData[];

  from: EmailData;
  subject: string;
  text?: string;
  html?: string;

  attachments?: AttachmentData[];
}

export type MailDataRequired = MailData & ({ text: string } | { html: string });
