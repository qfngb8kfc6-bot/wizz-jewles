import { Button, Hr, Link, Text } from '@react-email/components';
import { Detail, EmailLayout, palette, styles } from './layout';

export interface BookingEmailProps {
  name: string;
  reference: string;
  consultationName: string;
  formatLabel: string;
  when: string;
  visitorWhen?: string;
  location: string;
  manageUrl: string;
  googleUrl: string;
}

export default function BookingConfirmationEmail(p: BookingEmailProps) {
  const first = p.name.split(' ')[0];
  return (
    <EmailLayout preview={`Your consultation is confirmed — ${p.when}`}>
      <Text style={styles.label}>Consultation confirmed</Text>
      <Text style={styles.h1}>You’re booked in, {first}.</Text>
      <Text style={styles.p}>
        Your slot is locked in. A calendar invite is attached; if anything changes, you can reschedule or cancel at any time using
        your private link below.
      </Text>
      <Hr style={{ borderColor: palette.gold, margin: '28px 0' }} />
      <Detail label="Consultation" value={p.consultationName} />
      <Detail label="Format" value={p.formatLabel} />
      <Detail label="When" value={p.when} />
      {p.visitorWhen ? <Detail label="Your local time" value={p.visitorWhen} /> : null}
      <Detail label="Where" value={p.location} />
      <Detail label="Reference" value={p.reference} />
      <Hr style={{ borderColor: palette.line, margin: '12px 0 28px' }} />
      <Button href={p.manageUrl} style={styles.button}>
        Manage your booking
      </Button>
      <Text style={{ ...styles.p, marginTop: '24px', fontSize: '13px' }}>
        <Link href={p.googleUrl} style={styles.link}>
          Add to Google Calendar
        </Link>{' '}
        · Apple and Outlook: open the attached invitation.
      </Text>
      <Text style={{ ...styles.p, fontSize: '13px', color: palette.smoke }}>
        Got photos, screenshots or sketches of your idea? Just reply to this email.
      </Text>
    </EmailLayout>
  );
}
