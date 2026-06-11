import { Resend } from 'resend';
import { render } from 'react-email';
import type { ReactElement } from 'react';
import { SubmissionConfirmationEmail } from '@/emails/submission-confirmation-email';
import {
  OrderConfirmationEmail,
  type OrderEmailItem,
} from '@/emails/order-confirmation-email';
import { ContactNotificationEmail } from '@/emails/contact-notification-email';
import { ContactConfirmationEmail } from '@/emails/contact-confirmation-email';
import { AdminMessageEmail } from '@/emails/admin-message-email';

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || 'TelFixer <noreply@telfixer.nl>';
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
  replyTo?: string;
}

type SendResult = { success: boolean; error?: string };

async function sendEmail({
  to,
  subject,
  react,
  replyTo,
}: SendEmailOptions): Promise<SendResult> {
  if (!isEmailConfigured()) {
    console.warn('Email service not configured. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const text = await render(react, { plainText: true });

    const { error } = await getResendClient().emails.send({
      from: getFromAddress(),
      to,
      subject,
      react,
      text,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      console.error(`Failed to send email "${subject}" to ${to}:`, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

interface SubmissionEmailData {
  customerName: string;
  customerEmail: string;
  referenceNumber: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  conditionDescription: string;
}

/**
 * Device submission (inlevering) confirmation
 */
export async function sendSubmissionConfirmationEmail(
  data: SubmissionEmailData
): Promise<SendResult> {
  return sendEmail({
    to: data.customerEmail,
    subject: `Bevestiging inlevering - ${data.referenceNumber}`,
    react: SubmissionConfirmationEmail({
      customerName: data.customerName,
      referenceNumber: data.referenceNumber,
      deviceType: data.deviceType,
      deviceBrand: data.deviceBrand,
      deviceModel: data.deviceModel,
      conditionDescription: data.conditionDescription,
    }),
  });
}

interface OrderConfirmationEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: OrderEmailItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  discountCode?: string;
  total: number;
  shippingAddress: string;
}

/**
 * Order confirmation (payment received)
 */
export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData
): Promise<SendResult> {
  return sendEmail({
    to: data.customerEmail,
    subject: `Bestelling bevestigd - ${data.orderNumber}`,
    react: OrderConfirmationEmail({
      customerName: data.customerName,
      orderNumber: data.orderNumber,
      items: data.items,
      subtotal: data.subtotal,
      shipping: data.shipping,
      discount: data.discount,
      discountCode: data.discountCode,
      total: data.total,
      shippingAddress: data.shippingAddress,
    }),
  });
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subjectLabel: string;
  message: string;
}

/**
 * Contact form: internal notification to the TelFixer inbox.
 * Reply-to is set to the customer so the team can respond directly.
 */
export async function sendContactNotificationEmail(
  data: ContactEmailData
): Promise<SendResult> {
  const inbox = process.env.CONTACT_INBOX_EMAIL || 'info@telfixer.nl';

  return sendEmail({
    to: inbox,
    subject: `Contactformulier: ${data.subjectLabel} - ${data.name}`,
    replyTo: data.email,
    react: ContactNotificationEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subjectLabel: data.subjectLabel,
      message: data.message,
    }),
  });
}

/**
 * Contact form: confirmation (auto-reply) to the customer.
 */
export async function sendContactConfirmationEmail(
  data: ContactEmailData
): Promise<SendResult> {
  return sendEmail({
    to: data.email,
    subject: 'We hebben je bericht ontvangen - TelFixer',
    react: ContactConfirmationEmail({
      name: data.name,
      subjectLabel: data.subjectLabel,
      message: data.message,
    }),
  });
}

interface AdminCustomerEmailData {
  to: string;
  customerName?: string;
  subject: string;
  heading: string;
  bodyText: string;
  ctaUrl?: string;
  ctaLabel?: string;
  replyTo?: string;
}

/**
 * Free-form branded email composed by an admin and sent to a customer.
 */
export async function sendAdminCustomerEmail(
  data: AdminCustomerEmailData
): Promise<SendResult> {
  return sendEmail({
    to: data.to,
    subject: data.subject,
    replyTo: data.replyTo,
    react: AdminMessageEmail({
      customerName: data.customerName,
      heading: data.heading,
      bodyText: data.bodyText,
      ctaUrl: data.ctaUrl,
      ctaLabel: data.ctaLabel,
    }),
  });
}
