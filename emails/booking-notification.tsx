import { Button, Text } from '@react-email/components';
import { Detail, EmailLayout, styles } from './layout';

export interface BookingNotificationProps {
  reference: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  consultationName: string;
  formatLabel: string;
  when: string;
  visitorTimeZone?: string | null;
  budget?: string | null;
  message?: string | null;
  piece?: string | null;
  hasImage: boolean;
  adminUrl: string;
}

export default function BookingNotificationEmail(p: BookingNotificationProps) {
  return (
    <EmailLayout preview={`New booking: ${p.name} — ${p.when}`}>
      <Text style={styles.label}>New consultation</Text>
      <Text style={styles.h1}>{p.name}</Text>
      <Detail label="When" value={p.when} />
      <Detail label="Consultation" value={`${p.consultationName} · ${p.formatLabel}`} />
      <Detail label="Email" value={p.email} />
      <Detail label="Phone" value={p.phone} />
      <Detail label="Prefers" value={p.contactMethod} />
      {p.visitorTimeZone ? <Detail label="Visitor time zone" value={p.visitorTimeZone} /> : null}
      {p.budget ? <Detail label="Budget" value={p.budget} /> : null}
      {p.piece ? <Detail label="Enquiring about" value={p.piece} /> : null}
      {p.message ? <Detail label="Message" value={p.message} /> : null}
      <Detail label="Reference image" value={p.hasImage ? 'Attached in the dashboard' : 'None'} />
      <Detail label="Reference" value={p.reference} />
      <Button href={p.adminUrl} style={styles.button}>
        Open in dashboard
      </Button>
    </EmailLayout>
  );
}
