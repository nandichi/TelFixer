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

export interface OrderEmailItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  items: OrderEmailItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  discountCode?: string;
  total: number;
  shippingAddress: string;
}

function formatEur(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function OrderConfirmationEmail({
  customerName,
  orderNumber,
  items,
  subtotal,
  shipping,
  discount,
  discountCode,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <EmailLayout
      preview={`Bestelling ${orderNumber} is bevestigd. We maken je order zo snel mogelijk klaar voor verzending.`}
      heroTitle="Bestelling bevestigd"
      heroSubtitle="We maken je order zo snel mogelijk klaar"
    >
      <Text style={paragraphStyle}>Beste {customerName},</Text>
      <Text style={paragraphStyle}>
        Bedankt voor je bestelling. We hebben je betaling ontvangen en gaan de
        bestelling zo snel mogelijk voor je klaarmaken.
      </Text>

      <Section style={highlightBoxStyle}>
        <Text style={boxLabelStyle}>Bestelnummer</Text>
        <Section style={referenceBoxStyle}>
          <Text style={referenceValueStyle}>{orderNumber}</Text>
        </Section>
      </Section>

      <Text style={sectionHeadingStyle}>Je bestelling</Text>
      {items.map((item, index) => (
        <Row key={index}>
          <Column style={tableLabelStyle}>
            {item.name} × {item.quantity}
          </Column>
          <Column style={tableValueStyle}>
            {formatEur(item.price * item.quantity)}
          </Column>
        </Row>
      ))}
      <Row>
        <Column style={totalsLabelStyle}>Subtotaal</Column>
        <Column style={totalsValueStyle}>{formatEur(subtotal)}</Column>
      </Row>
      <Row>
        <Column style={totalsLabelStyle}>Verzending</Column>
        <Column style={totalsValueStyle}>
          {shipping === 0 ? 'Gratis' : formatEur(shipping)}
        </Column>
      </Row>
      {discount != null && discount > 0 && (
        <Row>
          <Column style={totalsLabelStyle}>
            Korting{discountCode ? ` (${discountCode})` : ''}
          </Column>
          <Column style={discountValueStyle}>-{formatEur(discount)}</Column>
        </Row>
      )}
      <Row>
        <Column style={grandTotalLabelStyle}>Totaal</Column>
        <Column style={grandTotalValueStyle}>{formatEur(total)}</Column>
      </Row>

      <Text style={sectionHeadingStyle}>Verzendadres</Text>
      <Text style={addressStyle}>{shippingAddress}</Text>

      <Text style={paragraphStyle}>
        Je ontvangt een track &amp; trace code zodra het pakket onderweg is.
      </Text>

      <Section style={ctaSectionStyle}>
        <Button
          href={`https://telfixer.nl/tracking?ref=${orderNumber}`}
          style={ctaButtonStyle}
        >
          Volg je bestelling
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

const totalsLabelStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '14px',
  color: brand.muted,
  padding: '10px 0',
};

const totalsValueStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '14px',
  color: brand.softBlack,
  padding: '10px 0',
  textAlign: 'right',
};

const discountValueStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '14px',
  fontWeight: 600,
  color: brand.success,
  padding: '10px 0',
  textAlign: 'right',
};

const grandTotalLabelStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '16px',
  fontWeight: 700,
  color: brand.primary,
  padding: '14px 0',
  borderTop: `2px solid ${brand.primary}`,
};

const grandTotalValueStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '16px',
  fontWeight: 700,
  color: brand.primary,
  padding: '14px 0',
  borderTop: `2px solid ${brand.primary}`,
  textAlign: 'right',
};

const addressStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '14px',
  color: '#475569',
  lineHeight: '1.6',
  margin: 0,
  whiteSpace: 'pre-line',
};

OrderConfirmationEmail.PreviewProps = {
  customerName: 'Naoufal',
  orderNumber: 'TF-ORD-2026-0001',
  items: [
    { name: 'iPhone 13 128GB Refurbished', quantity: 1, price: 429 },
    { name: 'Screenprotector iPhone 13', quantity: 2, price: 14.95 },
  ],
  subtotal: 458.9,
  shipping: 0,
  total: 458.9,
  shippingAddress: 'Houtrakbos 34\n6718HD Ede\nNederland',
} satisfies OrderConfirmationEmailProps;

export default OrderConfirmationEmail;
