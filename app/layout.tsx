import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Universal CRM',
  description: 'CRM minimalista para seguimiento de consultas de WhatsApp',
  icons: {
    icon: '/logo.png',
  },
};

import { ThemeProvider } from '../components/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <div className="app-container">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
