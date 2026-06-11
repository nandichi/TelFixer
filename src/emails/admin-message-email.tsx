import * as React from 'react';
import { Section, Text, Link } from 'react-email';
import {
  EmailLayout,
  paragraphStyle,
  ctaButtonStyle,
  ctaSectionStyle,
} from './email-layout';

export interface AdminMessageEmailProps {
  customerName?: string;
  heading: string;
  bodyText: string;
  ctaUrl?: string;
  ctaLabel?: string;
}

export function AdminMessageEmail({
  customerName,
  heading,
  bodyText,
  ctaUrl,
  ctaLabel,
}: AdminMessageEmailProps) {
  const paragraphs = bodyText
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <EmailLayout
      preview={heading}
      heroTitle={heading}
      heroSubtitle="Een bericht van TelFixer"
    >
      {customerName && (
        <Text style={paragraphStyle}>Beste {customerName},</Text>
      )}
      {paragraphs.map((p, i) => (
        <Text key={i} style={paragraphStyle}>
          {p}
        </Text>
      ))}

      {ctaUrl && ctaLabel && (
        <Section style={ctaSectionStyle}>
          <Link href={ctaUrl} style={ctaButtonStyle}>
            {ctaLabel}
          </Link>
        </Section>
      )}
    </EmailLayout>
  );
}

AdminMessageEmail.PreviewProps = {
  customerName: 'Jan Jansen',
  heading: 'Update over je bestelling',
  bodyText:
    'Je bestelling is vandaag verzonden en wordt binnen enkele dagen bezorgd.\n\nJe ontvangt apart een track & trace code zodra het pakket onderweg is.',
  ctaUrl: 'https://telfixer.nl/account',
  ctaLabel: 'Bekijk je account',
} satisfies AdminMessageEmailProps;

export default AdminMessageEmail;
