import * as React from 'react';
import { Column, Row, Section, Text } from 'react-email';
import {
  EmailLayout,
  brand,
  fontSans,
  highlightBoxStyle,
  sectionHeadingStyle,
  tableLabelStyle,
  tableValueStyle,
} from './email-layout';

export interface ContactNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  subjectLabel: string;
  message: string;
}

export function ContactNotificationEmail({
  name,
  email,
  phone,
  subjectLabel,
  message,
}: ContactNotificationEmailProps) {
  return (
    <EmailLayout
      preview={`Nieuw contactbericht van ${name}: ${subjectLabel}`}
      heroTitle="Nieuw contactbericht"
      heroSubtitle="Ingestuurd via het contactformulier op telfixer.nl"
    >
      <Text style={sectionHeadingStyle}>Gegevens afzender</Text>
      <Row>
        <Column style={tableLabelStyle}>Naam</Column>
        <Column style={tableValueStyle}>{name}</Column>
      </Row>
      <Row>
        <Column style={tableLabelStyle}>E-mail</Column>
        <Column style={tableValueStyle}>{email}</Column>
      </Row>
      <Row>
        <Column style={tableLabelStyle}>Telefoon</Column>
        <Column style={tableValueStyle}>{phone || 'Niet opgegeven'}</Column>
      </Row>
      <Row>
        <Column style={tableLabelStyle}>Onderwerp</Column>
        <Column style={tableValueStyle}>{subjectLabel}</Column>
      </Row>

      <Section style={highlightBoxStyle}>
        <Text style={messageLabelStyle}>Bericht</Text>
        <Text style={messageTextStyle}>{message}</Text>
      </Section>

      <Text style={replyHintStyle}>
        Beantwoord deze e-mail om direct te reageren naar {name} ({email}).
      </Text>
    </EmailLayout>
  );
}

const messageLabelStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '13px',
  fontWeight: 600,
  color: brand.primary,
  margin: '0 0 10px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const messageTextStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '15px',
  color: brand.softBlack,
  lineHeight: '1.7',
  margin: 0,
  whiteSpace: 'pre-line',
};

const replyHintStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '13px',
  color: brand.muted,
  lineHeight: '1.6',
  margin: '8px 0 0',
};

ContactNotificationEmail.PreviewProps = {
  name: 'Jan Jansen',
  email: 'jan@example.com',
  phone: '+31 6 12345678',
  subjectLabel: 'Garantie of reparatie',
  message:
    'Hoi, mijn iPhone die ik vorige maand bij jullie heb gekocht laadt niet meer op. Valt dit onder de garantie?\n\nGroeten, Jan',
} satisfies ContactNotificationEmailProps;

export default ContactNotificationEmail;
