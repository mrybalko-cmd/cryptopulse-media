import { SITE_BRAND } from '@/lib/site';
export const metadata = {
  title: `${SITE_BRAND} Studio`,
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
