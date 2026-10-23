import { Text } from '@react-email/components';
import { Detail, EmailLayout, styles } from './layout';

export interface ContactNotificationProps {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export default function ContactNotificationEmail(p: ContactNotificationProps) {
  return (
    <EmailLayout preview={`New enquiry from ${p.name}`}>
      <Text style={styles.label}>New enquiry</Text>
      <Text style={styles.h1}>{p.subject || 'Website enquiry'}</Text>
      <Detail label="From" value={`${p.name} <${p.email}>`} />
      {p.phone ? <Detail label="Phone" value={p.phone} /> : null}
      <Detail label="Message" value={p.message} />
    </EmailLayout>
  );
}
