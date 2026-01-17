
export interface SendResult {
    success: boolean;
    messageId?: string;
    error?: string;
    provider: string;
}

export interface SendingAccount {
    id: string;
    email: string; // e.g. "alex@domain1.com"
    name: string;
    provider: 'mock' | 'resend' | 'gmail';
    dailyLimit: number;
    sentCount: number;
    lastSentAt?: Date;
}

export interface EmailContent {
    to: string;
    subject: string;
    body: string; // Text body
    html?: string;
}

export interface EmailProvider {
    sendEmail(account: SendingAccount, content: EmailContent): Promise<SendResult>;
}
