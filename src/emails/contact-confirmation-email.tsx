import * as React from 'react';
import { Section, Text } from 'react-email';
import {
  EmailLayout,
  brand,
  fontSans,
  highlightBoxStyle,
  paragraphStyle,
} from './email-layout';

export interface ContactConfirmationEmailProps {
  name: string;
  subjectLabel: string;
  message: string;
}

export function ContactConfirmationEmail({
  name,
  subjectLabel,
  message,
}: ContactConfirmationEmailProps) {
  return (
    <EmailLayout
      preview="We hebben je bericht ontvangen en reageren binnen 24 uur op werkdagen."
      heroTitle="Bericht ontvangen"
      heroSubtitle="We nemen zo snel mogelijk contact met je op"
    >
      <Text style={paragraphStyle}>Beste {name},</Text>
      <Text style={paragraphStyle}>
        Bedankt voor je bericht. We hebben het in goede orde ontvangen en
        streven ernaar om binnen 24 uur te reageren tijdens werkdagen.
      </Text>

      <Section style={highlightBoxStyle}>
        <Text style={summaryLabelStyle}>Jouw bericht over: {subjectLabel}</Text>
        <Text style={summaryTextStyle}>{message}</Text>
      </Section>

      <Text style={paragraphStyle}>
        Is je vraag dringend? Bel ons dan op +31 6 44642162 of stuur een
        WhatsApp, dan helpen we je sneller verder.
      </Text>
    </EmailLayout>
  );
}

const summaryLabelStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '13px',
  fontWeight: 600,
  color: brand.primary,
  margin: '0 0 10px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const summaryTextStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '14px',
  color: '#475569',
  lineHeight: '1.7',
  margin: 0,
  whiteSpace: 'pre-line',
};

ContactConfirmationEmail.PreviewProps = {
  name: 'Jan Jansen',
  subjectLabel: 'Garantie of reparatie',
  message:
    'Hoi, mijn iPhone die ik vorige maand bij jullie heb gekocht laadt niet meer op. Valt dit onder de garantie?\n\nGroeten, Jan',
} satisfies ContactConfirmationEmailProps;

export default ContactConfirmationEmail;
