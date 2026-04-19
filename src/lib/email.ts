import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
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

interface RepairRequestEmailData {
  customerName: string;
  customerEmail: string;
  referenceNumber: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  repairType: string;
  problemDescription: string;
}

interface OrderEmailItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: OrderEmailItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

function formatEur(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

function emailLayout({
  title,
  badgeLabel,
  badgeSubtitle,
  bodyHtml,
}: {
  title: string;
  badgeLabel: string;
  badgeSubtitle: string;
  bodyHtml: string;
}): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2C3E48; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #094543; font-size: 28px; margin-bottom: 8px;">TelFixer</h1>
        <p style="color: #64748B; font-size: 14px;">Kwaliteit waar je van lacht</p>
      </div>

      <div style="background: linear-gradient(135deg, #094543 0%, #0D9488 100%); color: white; padding: 24px; border-radius: 16px; text-align: center; margin-bottom: 24px;">
        <h2 style="margin: 0 0 8px 0; font-size: 24px;">${badgeLabel}</h2>
        <p style="margin: 0; opacity: 0.9;">${badgeSubtitle}</p>
      </div>

      ${bodyHtml}

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;">

      <p style="color: #64748B; font-size: 13px; text-align: center;">
        Heb je vragen? Neem gerust contact met ons op via
        <a href="mailto:info@telfixer.nl" style="color: #094543;">info@telfixer.nl</a>
        of WhatsApp
        <a href="https://wa.me/31644642162" style="color: #094543;">+31 6 44642162</a>.
      </p>

      <p style="color: #94A3B8; font-size: 12px; text-align: center; margin-top: 24px;">
        TelFixer · Houtrakbos 34 · 6718HD Ede<br>
        Dit is een automatisch gegenereerd bericht.
      </p>
    </body>
  </html>`;
}

/**
 * Device submission (inlevering) confirmation
 */
export async function sendSubmissionConfirmationEmail(
  data: SubmissionEmailData
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn('Email service not configured. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }

  const bodyHtml = `
    <p>Beste ${data.customerName},</p>
    <p>Bedankt voor het indienen van je apparaat bij TelFixer! We hebben je aanvraag ontvangen en beoordelen deze zo snel mogelijk.</p>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="color: #094543; margin: 0 0 16px 0; font-size: 16px;">Je referentienummer</h3>
      <div style="background: white; border: 2px solid #094543; border-radius: 8px; padding: 16px; text-align: center;">
        <span style="font-size: 28px; font-weight: bold; color: #094543; letter-spacing: 2px;">${data.referenceNumber}</span>
      </div>
    </div>

    <h3 style="color: #094543; margin: 24px 0 12px 0;">Samenvatting van je inlevering</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px 0; color: #64748B;">Type apparaat</td>
        <td style="padding: 12px 0; font-weight: 500; text-align: right;">${data.deviceType}</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px 0; color: #64748B;">Merk</td>
        <td style="padding: 12px 0; font-weight: 500; text-align: right;">${data.deviceBrand}</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px 0; color: #64748B;">Model</td>
        <td style="padding: 12px 0; font-weight: 500; text-align: right;">${data.deviceModel}</td>
      </tr>
    </table>

    <div style="background: #FEF3C7; border-radius: 12px; padding: 16px; margin: 24px 0;">
      <h4 style="color: #92400E; margin: 0 0 8px 0; font-size: 14px;">Conditie</h4>
      <p style="color: #78350F; margin: 0; font-size: 14px;">${data.conditionDescription}</p>
    </div>

    <h3 style="color: #094543; margin: 24px 0 12px 0;">Wat gebeurt er na indienen?</h3>
    <ol style="padding-left: 20px; color: #475569;">
      <li style="margin-bottom: 8px;">Je ontvangt binnen 2 werkdagen een prijsaanbod per e-mail en WhatsApp.</li>
      <li style="margin-bottom: 8px;">Als je akkoord gaat, ontvang je gratis verzendlabels om het apparaat naar ons te sturen.</li>
      <li style="margin-bottom: 8px;">Na ontvangst en controle wordt het bedrag uitbetaald.</li>
    </ol>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://telfixer.nl/tracking?ref=${data.referenceNumber}" style="display: inline-block; background: #094543; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 500;">
        Volg je inlevering
      </a>
    </div>
  `;

  try {
    const { error } = await getResendClient().emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'TelFixer <noreply@telfixer.nl>',
      to: data.customerEmail,
      subject: `Bevestiging inlevering - ${data.referenceNumber}`,
      html: emailLayout({
        title: 'Bevestiging inlevering',
        badgeLabel: 'Inlevering ontvangen!',
        badgeSubtitle: 'Je aanvraag is succesvol ingediend',
        bodyHtml,
      }),
    });

    if (error) {
      console.error('Failed to send email:', error);
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

/**
 * Repair request confirmation
 */
export async function sendRepairRequestEmail(
  data: RepairRequestEmailData
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn('Email service not configured. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }

  const bodyHtml = `
    <p>Beste ${data.customerName},</p>
    <p>We hebben je reparatieaanvraag ontvangen. Binnen 24 uur nemen we contact met je op om een afspraak te maken.</p>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="color: #094543; margin: 0 0 16px 0; font-size: 16px;">Je referentienummer</h3>
      <div style="background: white; border: 2px solid #094543; border-radius: 8px; padding: 16px; text-align: center;">
        <span style="font-size: 28px; font-weight: bold; color: #094543; letter-spacing: 2px;">${data.referenceNumber}</span>
      </div>
    </div>

    <h3 style="color: #094543; margin: 24px 0 12px 0;">Details van je aanvraag</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px 0; color: #64748B;">Apparaat</td>
        <td style="padding: 12px 0; font-weight: 500; text-align: right;">${data.deviceType} · ${data.deviceBrand} ${data.deviceModel}</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px 0; color: #64748B;">Type reparatie</td>
        <td style="padding: 12px 0; font-weight: 500; text-align: right;">${data.repairType}</td>
      </tr>
    </table>

    <div style="background: #FEF3C7; border-radius: 12px; padding: 16px; margin: 24px 0;">
      <h4 style="color: #92400E; margin: 0 0 8px 0; font-size: 14px;">Omschrijving</h4>
      <p style="color: #78350F; margin: 0; font-size: 14px;">${data.problemDescription}</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://telfixer.nl/tracking?ref=${data.referenceNumber}" style="display: inline-block; background: #094543; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 500;">
        Volg je reparatie
      </a>
    </div>
  `;

  try {
    const { error } = await getResendClient().emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'TelFixer <noreply@telfixer.nl>',
      to: data.customerEmail,
      subject: `Bevestiging reparatieaanvraag - ${data.referenceNumber}`,
      html: emailLayout({
        title: 'Reparatieaanvraag ontvangen',
        badgeLabel: 'Aanvraag ontvangen!',
        badgeSubtitle: 'We nemen zo snel mogelijk contact met je op',
        bodyHtml,
      }),
    });

    if (error) {
      console.error('Failed to send repair email:', error);
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

/**
 * Order confirmation (payment received)
 */
export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn('Email service not configured. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px 0; color: #475569;">${item.name} × ${item.quantity}</td>
        <td style="padding: 12px 0; font-weight: 500; text-align: right;">${formatEur(
          item.price * item.quantity
        )}</td>
      </tr>
    `
    )
    .join('');

  const bodyHtml = `
    <p>Beste ${data.customerName},</p>
    <p>Bedankt voor je bestelling. We hebben je betaling ontvangen en gaan de bestelling zo snel mogelijk voor je klaarmaken.</p>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="color: #094543; margin: 0 0 16px 0; font-size: 16px;">Bestelnummer</h3>
      <div style="background: white; border: 2px solid #094543; border-radius: 8px; padding: 16px; text-align: center;">
        <span style="font-size: 24px; font-weight: bold; color: #094543; letter-spacing: 1px;">${data.orderNumber}</span>
      </div>
    </div>

    <h3 style="color: #094543; margin: 24px 0 12px 0;">Je bestelling</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${itemsHtml}
      <tr>
        <td style="padding: 12px 0; color: #64748B;">Subtotaal</td>
        <td style="padding: 12px 0; text-align: right;">${formatEur(data.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; color: #64748B;">Verzending</td>
        <td style="padding: 12px 0; text-align: right;">${
          data.shipping === 0 ? 'Gratis' : formatEur(data.shipping)
        }</td>
      </tr>
      <tr style="border-top: 2px solid #094543;">
        <td style="padding: 14px 0; font-weight: 700; font-size: 16px; color: #094543;">Totaal</td>
        <td style="padding: 14px 0; font-weight: 700; font-size: 16px; text-align: right; color: #094543;">${formatEur(
          data.total
        )}</td>
      </tr>
    </table>

    <h3 style="color: #094543; margin: 24px 0 12px 0;">Verzendadres</h3>
    <p style="color: #475569; margin: 0;">${data.shippingAddress}</p>

    <p style="margin-top: 24px;">Je bestelling wordt zo snel mogelijk verzonden. Je ontvangt een track &amp; trace code zodra het pakket onderweg is.</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://telfixer.nl/tracking?ref=${data.orderNumber}" style="display: inline-block; background: #094543; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 500;">
        Volg je bestelling
      </a>
    </div>
  `;

  try {
    const { error } = await getResendClient().emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'TelFixer <noreply@telfixer.nl>',
      to: data.customerEmail,
      subject: `Bestelling bevestigd - ${data.orderNumber}`,
      html: emailLayout({
        title: 'Bevestiging bestelling',
        badgeLabel: 'Bestelling bevestigd!',
        badgeSubtitle: 'We maken je order zo snel mogelijk klaar',
        bodyHtml,
      }),
    });

    if (error) {
      console.error('Failed to send order email:', error);
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
