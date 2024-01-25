export interface IMail {
  fromEmail?: string;
  toEmail: string | string[];
  subject: string;
  context: object;
  dir?: string;
  template: string;
  replyTo?: string;
  bcc?: string | string[];
}
