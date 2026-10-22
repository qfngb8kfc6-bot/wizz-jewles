import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from '@react-email/components';
import type { ReactNode } from 'react';
import { site } from '@/content/site';

export const palette = {
  ink: '#0E0E0F',
  ivory: '#F6F2EA',
  gold: '#C9A96E',
  goldDeep: '#8A6D3B',
  stone: '#6B625A',
};

const serif = "'Cormorant Garamond', 'Times New Roman', Georgia, serif";
const sans = "'Manrope', 'Helvetica Neue', Arial, sans-serif";

export const styles = {
  h1: { fontFamily: serif, fontSize: '34px', lineHeight: '40px', fontWeight: 500, color: palette.ink, margin: '0 0 16px' },
  p: { fontFamily: sans, fontSize: '15px', lineHeight: '24px', color: '#2A2724', margin: '0 0 16px' },
  label: {
    fontFamily: sans,
    fontSize: '11px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase' as const,
    color: palette.goldDeep,
    margin: '0 0 4px',
  },
  value: { fontFamily: sans, fontSize: '15px', lineHeight: '22px', color: palette.ink, margin: '0 0 18px' },
  button: {
    fontFamily: sans,
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    backgroundColor: palette.ink,
    color: palette.ivory,
    padding: '14px 26px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  link: { color: palette.goldDeep, textDecoration: 'underline' },
};

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: palette.ivory, margin: 0, padding: '32px 0' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFDF9', border: `1px solid #E7DFD1` }}>
          <Section style={{ backgroundColor: palette.ink, padding: '28px 40px', textAlign: 'center' as const }}>
            <Text
              style={{
                fontFamily: serif,
                fontSize: '22px',
                letterSpacing: '8px',
                color: palette.ivory,
                margin: 0,
              }}
            >
              WIZZ JEWELS
            </Text>
            <Hr style={{ borderColor: palette.gold, width: '48px', margin: '12px auto 0' }} />
          </Section>
          <Section style={{ padding: '40px' }}>{children}</Section>
          <Section style={{ padding: '24px 40px 36px', borderTop: '1px solid #E7DFD1' }}>
            <Text style={{ ...styles.p, fontSize: '12px', lineHeight: '19px', color: palette.stone, margin: 0 }}>
              {site.name} · {site.address.oneLine}
              <br />
              <Link href={`mailto:${site.email}`} style={{ color: palette.stone }}>
                {site.email}
              </Link>{' '}
              · {site.phone}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </>
  );
}
