import { ViewTransition } from 'react';

/** Re-mounts on navigation, so each route fades/rises in via the `.page` view-transition class. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
