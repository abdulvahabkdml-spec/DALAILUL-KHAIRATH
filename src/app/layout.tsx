import type { Metadata } from 'next';
import PublicShell from '@/components/PublicShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dalailul Khairath Official Portal | The Sanctuary of Sacred Scholarship',
  description: 'Dalailul Khairath Official Portal',
  icons: {
    icon: '/icon.png',
  },
};

import { Providers } from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400&family=Lexend:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Outfit:wght@400;500;600;700;800&family=Manjari:wght@400;700&family=Gayathri:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface font-body text-on-surface">
        <Providers>
          <PublicShell>{children}</PublicShell>
        </Providers>
      </body>
    </html>
  );
}
