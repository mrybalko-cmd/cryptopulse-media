import '../globals.css';

export const metadata = {
  title: 'CryptoPulse Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-[#0f1115] text-[#eef0f4]" style={{ fontFamily: '-apple-system,"Segoe UI",Roboto,sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
