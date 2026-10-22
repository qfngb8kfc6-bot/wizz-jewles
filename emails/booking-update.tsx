import { Button, Text } from '@react-email/components';
import { Detail, EmailLayout, styles } from './layout';

export interface BookingUpdateProps {
  kind: 'rescheduled' | 'cancelled';
  audience: 'customer' | 'studio';
  name: string;
  reference: string;
  consultationName: string;
  when: string;
  bookUrl: string;
  manageUrl?: string;
}

export default function BookingUpdateEmail(p: BookingUpdateProps) {
  const rescheduled = p.kind === 'rescheduled';
  const first = p.name.split(' ')[0];
  const heading =
    p.audience === 'studio'
      ? `${p.name} has ${rescheduled ? 'rescheduled' : 'cancelled'}`
      : rescheduled
        ? `Your new time is confirmed, ${first}.`
        : `Your consultation has been cancelled.`;
  return (
    <EmailLayout preview={heading}>
      <Text style={styles.label}>{rescheduled ? 'Booking rescheduled' : 'Booking cancelled'}</Text>
      <Text style={styles.h1}>{heading}</Text>
      <Detail label="Consultation" value={p.consultationName} />
      <Detail label={rescheduled ? 'New time' : 'Was'} value={p.when} />
      <Detail label="Reference" value={p.reference} />
      {p.audience === 'customer' ? (
        rescheduled && p.manageUrl ? (
          <Button href={p.manageUrl} style={styles.button}>
            Manage your booking
          </Button>
        ) : (
          <>
            <Text style={styles.p}>We hope to see you another time. You are always welcome to book a new consultation.</Text>
            <Button href={p.bookUrl} style={styles.button}>
              Book a consultation
            </Button>
          </>
        )
      ) : null}
    </EmailLayout>
  );
}
