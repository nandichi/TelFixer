import * as React from 'react';
import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email';

export const brand = {
  primary: '#094543',
  primaryLight: '#0d6965',
  primaryDark: '#052e2d',
  cream: '#FAF8F5',
  champagne: '#F5EDE2',
  sand: '#E8DFD4',
  softBlack: '#1A1A1A',
  copper: '#B87333',
  gold: '#C9A96E',
  muted: '#64748B',
  success: '#0D9488',
} as const;

export const fontSans =
  "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
export const fontDisplay = "'Playfair Display', Georgia, 'Times New Roman', serif";

const siteUrl = 'https://telfixer.nl';
const logoUrl = `${siteUrl}/telfixer-logo.png`;

interface EmailLayoutProps {
  preview: string;
  heroTitle: string;
  heroSubtitle: string;
  children: React.ReactNode;
}

export function EmailLayout({
  preview,
  heroTitle,
  heroSubtitle,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang="nl">
      <Head>
        <Font
          fontFamily="Manrope"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSvfedN4.woff2',
            format: 'woff2',
          }}
          fontWeight="400 700"
          fontStyle="normal"
        />
        <Font
          fontFamily="Playfair Display"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiunDXbtPK-F2qC0s.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Logo header */}
          <Section style={logoSectionStyle}>
            <Img
              src={logoUrl}
              alt="TelFixer"
              width="72"
              height="71"
              style={logoStyle}
            />
            <Text style={wordmarkStyle}>TelFixer</Text>
            <Text style={taglineStyle}>Kwaliteit waar je van lacht</Text>
          </Section>

          {/* Card */}
          <Section style={cardStyle}>
            {/* Gold accent bar */}
            <Section style={accentBarStyle} />

            {/* Hero */}
            <Section style={heroStyle}>
              <Text style={heroTitleStyle}>{heroTitle}</Text>
              <Text style={heroSubtitleStyle}>{heroSubtitle}</Text>
            </Section>

            {/* Content */}
            <Section style={contentStyle}>{children}</Section>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerContactStyle}>
              Vragen? Mail naar{' '}
              <Link href="mailto:info@telfixer.nl" style={footerLinkStyle}>
                info@telfixer.nl
              </Link>{' '}
              of stuur een WhatsApp naar{' '}
              <Link href="https://wa.me/31644642162" style={footerLinkStyle}>
                +31 6 44642162
              </Link>
            </Text>
            <Hr style={footerHrStyle} />
            <Text style={footerMetaStyle}>
              TelFixer · Houtrakbos 34 · 6718HD Ede
              <br />
              KVK 99703645 · BTW NL005404670B51
            </Text>
            <Text style={footerNoteStyle}>
              Dit is een automatisch verzonden bericht via{' '}
              <Link href={siteUrl} style={footerLinkStyle}>
                telfixer.nl
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: brand.cream,
  fontFamily: fontSans,
  margin: 0,
  padding: '24px 12px',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
};

const logoSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '16px 0 24px',
};

const logoStyle: React.CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

const wordmarkStyle: React.CSSProperties = {
  fontFamily: fontDisplay,
  fontSize: '26px',
  fontWeight: 700,
  color: brand.primary,
  margin: '10px 0 0',
  lineHeight: '1.2',
};

const taglineStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '13px',
  color: brand.muted,
  margin: '4px 0 0',
  lineHeight: '1.4',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: `1px solid ${brand.sand}`,
  overflow: 'hidden',
};

const accentBarStyle: React.CSSProperties = {
  height: '4px',
  lineHeight: '4px',
  fontSize: '1px',
  background: `linear-gradient(90deg, ${brand.copper} 0%, ${brand.gold} 50%, ${brand.copper} 100%)`,
  backgroundColor: brand.gold,
};

const heroStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.primaryLight} 100%)`,
  backgroundColor: brand.primary,
  padding: '32px 40px',
  textAlign: 'center',
};

const heroTitleStyle: React.CSSProperties = {
  fontFamily: fontDisplay,
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: 700,
  margin: 0,
  lineHeight: '1.3',
};

const heroSubtitleStyle: React.CSSProperties = {
  fontFamily: fontSans,
  color: '#D9E6E4',
  fontSize: '14px',
  margin: '8px 0 0',
  lineHeight: '1.5',
};

const contentStyle: React.CSSProperties = {
  padding: '32px 40px 36px',
};

const footerStyle: React.CSSProperties = {
  backgroundColor: brand.champagne,
  borderRadius: '16px',
  border: `1px solid ${brand.sand}`,
  marginTop: '16px',
  padding: '24px 32px',
  textAlign: 'center',
};

const footerContactStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '13px',
  color: brand.softBlack,
  margin: 0,
  lineHeight: '1.6',
};

const footerLinkStyle: React.CSSProperties = {
  fontFamily: fontSans,
  color: brand.primary,
  textDecoration: 'underline',
};

const footerHrStyle: React.CSSProperties = {
  borderColor: brand.sand,
  margin: '16px 0',
};

const footerMetaStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '12px',
  color: brand.muted,
  margin: 0,
  lineHeight: '1.6',
};

const footerNoteStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '11px',
  color: '#94A3B8',
  margin: '12px 0 0',
  lineHeight: '1.5',
};

/* Shared content styles for templates */

export const paragraphStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '15px',
  color: '#334155',
  lineHeight: '1.65',
  margin: '0 0 16px',
};

export const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: fontDisplay,
  fontSize: '17px',
  fontWeight: 700,
  color: brand.primary,
  margin: '28px 0 12px',
  lineHeight: '1.3',
};

export const highlightBoxStyle: React.CSSProperties = {
  backgroundColor: brand.cream,
  border: `1px solid ${brand.sand}`,
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

export const referenceBoxStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: `2px solid ${brand.primary}`,
  borderRadius: '10px',
  padding: '14px 16px',
  textAlign: 'center',
};

export const referenceValueStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '24px',
  fontWeight: 700,
  color: brand.primary,
  letterSpacing: '2px',
  margin: 0,
  lineHeight: '1.3',
};

export const tableLabelStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '14px',
  color: brand.muted,
  padding: '10px 0',
  borderBottom: `1px solid ${brand.sand}`,
};

export const tableValueStyle: React.CSSProperties = {
  fontFamily: fontSans,
  fontSize: '14px',
  fontWeight: 600,
  color: brand.softBlack,
  padding: '10px 0',
  borderBottom: `1px solid ${brand.sand}`,
  textAlign: 'right',
};

export const ctaButtonStyle: React.CSSProperties = {
  fontFamily: fontSans,
  backgroundColor: brand.primary,
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  padding: '14px 28px',
  borderRadius: '10px',
  display: 'inline-block',
};

export const ctaSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0 8px',
};
