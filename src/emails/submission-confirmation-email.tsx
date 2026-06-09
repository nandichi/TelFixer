import * as React from 'react';
import { Button, Column, Row, Section, Text } from 'react-email';
import {
  EmailLayout,
  brand,
  ctaButtonStyle,
  ctaSectionStyle,
  fontSans,
  highlightBoxStyle,
  paragraphStyle,
  referenceBoxStyle,
  referenceValueStyle,
  sectionHeadingStyle,
  tableLabelStyle,
  tableValueStyle,
} from './email-layout';

export interface SubmissionConfirmationEmailProps {
  customerName: string;
  referenceNumber: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  conditionDescription: string;
}

export function SubmissionConfirmationEmail({
  customerName,
  referenceNumber,
  deviceType,
  deviceBrand,
  deviceModel,
  conditionDescription,
}: SubmissionConfirmationEmailProps) {
  return (
    <EmailLayout
      preview={`Je inlevering ${referenceNumber} is ontvangen. Binnen 2 werkdagen ontvang je een prijsaanbod.`}
      heroTitle="Inlevering ontvangen"
      heroSubtitle="Je aanvraag is succesvol ingediend"
    >
      <Text style={paragraphStyle}>Beste {customerName},</Text>
      <Text style={paragraphStyle}>
        Bedankt voor het indienen van je apparaat bij TelFixer. We hebben je
        aanvraag ontvangen en beoordelen deze zo snel mogelijk.
      </Text>

      <Section style={highlightBoxStyle}>
        <Text style={boxLabelStyle}>Je referentienummer</Text>
        <Section style={referenceBoxStyle}>
          <Text style={referenceValueStyle}>{referenceNumber}</Text>
        </Section>
      </Section>

      <Text style={sectionHeadingStyle}>Samenvatting van je inlevering</Text>
      <Row>
        <Column style={tableLabelStyle}>Type apparaat</Column>
        <Column style={tableValueStyle}>{deviceType}</Column>
      </Row>
      <Row>
        <Column style={tableLabelStyle}>Merk</Column>
        <Column style={tableValueStyle}>{deviceBrand}</Column>
      </Row>
      <Row>
        <Column style={tableLabelStyle}>Model</Column>
        <Column style={tableValueStyle}>{deviceModel}</Column>
      </Row>

      {conditionDescription ? (
        <Section style={conditionBoxStyle}>
          <Text style={conditionLabelStyle}>Omschreven conditie</Text>
          <Text style={conditionTextStyle}>{conditionDescription}</Text>
        </Section>
      ) : null}

      <Text style={sectionHeadingStyle}>Wat gebeurt er nu?</Text>
      <Text style={stepStyle}>
        1. Je ontvangt binnen 2 werkdagen een prijsaanbod per e-mail en
        WhatsApp.
      </Text>
      <Text style={stepStyle}>
        2. Ga je akkoord? Dan ontvang je een gratis verzendlabel om het
        apparaat naar ons te sturen.
      </Text>
      <Text style={stepStyle}>
        3. Na ontvangst en controle betalen we het bedrag uit.
      </Text>

      <Section style={ctaSectionStyle}>
        <Button
          href={`https://telfixer.nl/tracking?ref=${referenceNumber}`}
          style={ctaButtonStyle}
        >
          Volg je inlevering
        </Button>
      </Section>
    </EmailLayout>
  );
}

const boxLabelStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '13px',
  fontWeight: 600,
  color: brand.primary,
  margin: '0 0 12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const conditionBoxStyle: React.CSSProperties = {
  backgroundColor: '#FEF3C7',
  borderRadius: '12px',
  padding: '16px 20px',
  margin: '24px 0',
};

const conditionLabelStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '13px',
  fontWeight: 700,
  color: '#92400E',
  margin: '0 0 6px',
};

const conditionTextStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '14px',
  color: '#78350F',
  margin: 0,
  lineHeight: '1.6',
};

const stepStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '14px',
  color: '#475569',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

SubmissionConfirmationEmail.PreviewProps = {
  customerName: 'Naoufal',
  referenceNumber: 'TF-2026-0001',
  deviceType: 'Smartphone',
  deviceBrand: 'Apple',
  deviceModel: 'iPhone 14 Pro',
  conditionDescription:
    'Scherm heeft lichte krassen, batterijconditie 87%, verder volledig functioneel.',
} satisfies SubmissionConfirmationEmailProps;

export default SubmissionConfirmationEmail;
