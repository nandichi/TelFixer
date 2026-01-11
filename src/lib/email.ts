import { Resend } from 'resend';

// Lazy initialization of Resend client
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

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Send confirmation email for device submission
 */
export async function sendSubmissionConfirmationEmail(data: SubmissionEmailData): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn('Email service not configured. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { error } = await getResendClient().emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'TelFixer <noreply@telfixer.nl>',
      to: data.customerEmail,
      subject: `Bevestiging inlevering - ${data.referenceNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2C3E48; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #094543; font-size: 28px; margin-bottom: 8px;">TelFixer</h1>
              <p style="color: #64748B; font-size: 14px;">Kwaliteit waar je van lacht</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #0D9488 0%, #14B8A6 100%); color: white; padding: 24px; border-radius: 16px; text-align: center; margin-bottom: 24px;">
              <h2 style="margin: 0 0 8px 0; font-size: 24px;">Inlevering ontvangen!</h2>
              <p style="margin: 0; opacity: 0.9;">Je aanvraag is succesvol ingediend</p>
            </div>
            
            <p>Beste ${data.customerName},</p>
            
            <p>Bedankt voor het indienen van je apparaat bij TelFixer! We hebben je aanvraag ontvangen en gaan deze zo snel mogelijk beoordelen.</p>
            
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #094543; margin: 0 0 16px 0; font-size: 16px;">Je referentienummer:</h3>
              <div style="background: white; border: 2px solid #094543; border-radius: 8px; padding: 16px; text-align: center;">
                <span style="font-size: 28px; font-weight: bold; color: #094543; letter-spacing: 2px;">${data.referenceNumber}</span>
              </div>
              <p style="color: #64748B; font-size: 13px; margin: 12px 0 0 0; text-align: center;">Bewaar dit nummer om de status van je inlevering te volgen</p>
            </div>
            
            <h3 style="color: #094543; margin: 24px 0 12px 0;">Samenvatting van je inlevering:</h3>
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
              <h4 style="color: #92400E; margin: 0 0 8px 0; font-size: 14px;">Conditie beschrijving:</h4>
              <p style="color: #78350F; margin: 0; font-size: 14px;">${data.conditionDescription}</p>
            </div>
            
            <h3 style="color: #094543; margin: 24px 0 12px 0;">Wat kun je verwachten?</h3>
            <ol style="padding-left: 20px; color: #475569;">
              <li style="margin-bottom: 8px;">Je ontvangt binnen 2 werkdagen een e-mail met een prijsaanbod</li>
              <li style="margin-bottom: 8px;">Bij akkoord ontvang je gratis verzendlabels</li>
              <li style="margin-bottom: 8px;">Na ontvangst en controle wordt het bedrag uitbetaald</li>
            </ol>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://telfixer.nl/tracking?ref=${data.referenceNumber}" style="display: inline-block; background: #094543; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 500;">
                Volg je inlevering
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;">
            
            <p style="color: #64748B; font-size: 13px; text-align: center;">
              Heb je vragen? Neem gerust contact met ons op via <a href="mailto:info@telfixer.nl" style="color: #094543;">info@telfixer.nl</a>
            </p>
            
            <p style="color: #94A3B8; font-size: 12px; text-align: center; margin-top: 24px;">
              TelFixer - Ede, Gelderland<br>
              Dit is een automatisch gegenereerd bericht.
            </p>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
