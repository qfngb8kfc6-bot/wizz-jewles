import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from '@react-email/components';
import type { ReactNode } from 'react';
import { logos } from '@/content/brand';
import { contact, locationLine, site } from '@/content/site';
import { siteUrl } from '@/lib/site-url';

export const palette = {
  void: '#000000',
  night: '#0A0A0C',
  line: '#26262C',
  goldBright: '#E0B979',
  gold: '#C98A3A',
  ice: '#E9EEF5',
  smoke: '#8A8A93',
};

const serif = "'Cormorant Garamond', 'Times New Roman', Georgia, serif";
const sans = "'Manrope', 'Helvetica Neue', Arial, sans-serif";

export const styles = {
  h1: { fontFamily: serif, fontSize: '34px', lineHeight: '40px', fontWeight: 500, color: palette.ice, margin: '0 0 16px' },
  p: { fontFamily: sans, fontSize: '15px', lineHeight: '24px', color: '#C9CED6', margin: '0 0 16px' },
  label: {
    fontFamily: sans,
    fontSize: '11px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase' as const,
    color: palette.goldBright,
    margin: '0 0 4px',
  },
  value: { fontFamily: sans, fontSize: '15px', lineHeight: '22px', color: palette.ice, margin: '0 0 18px' },
  button: {
    fontFamily: sans,
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    backgroundColor: palette.void,
    color: palette.goldBright,
    border: `1px solid ${palette.gold}`,
    padding: '14px 26px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  link: { color: palette.goldBright, textDecoration: 'underline' },
};

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: palette.void, margin: 0, padding: '32px 0' }}>
        <Container
          style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: palette.night, border: `1px solid ${palette.line}` }}
        >
          {/* Logo on pure black, exactly as supplied. */}
          <Section style={{ backgroundColor: palette.void, padding: '28px 40px 20px', textAlign: 'center' as const }}>
            <Img
              src={siteUrl(logos.square.src)}
              width="140"
              height="140"
              alt={site.name}
              style={{ display: 'block', margin: '0 auto', backgroundColor: palette.void }}
            />
            <Hr style={{ borderColor: palette.gold, width: '48px', margin: '16px auto 0' }} />
          </Section>
          <Section style={{ padding: '40px' }}>{children}</Section>
          <Section style={{ padding: '24px 40px 36px', borderTop: `1px solid ${palette.line}` }}>
            <Text style={{ ...styles.p, fontSize: '12px', lineHeight: '19px', color: palette.smoke, margin: 0 }}>
              {site.name}
              {contact ? (
                <>
                  {' '}
                  · {locationLine}
                  <br />
                  <Link href={`mailto:${contact.email}`} style={{ color: palette.smoke }}>
                    {contact.email}
                  </Link>{' '}
                  · {contact.phone}
                </>
              ) : (
                <>
                  {' '}
                  ·{' '}
                  <Link href={siteUrl('/contact')} style={{ color: palette.smoke }}>
                    Get in touch
                  </Link>
                </>
              )}
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
