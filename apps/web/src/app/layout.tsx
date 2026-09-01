import '@/styles/globals.css';
import localFont from 'next/font/local';
import { DynamicLayoutProviders } from './DynamicLayoutProviders';
import { ClientLayout } from './ClientLayout';

const roboto = localFont({
  src: [
    { path: '../../node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/roboto/files/roboto-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../../node_modules/@fontsource/roboto/files/roboto-latin-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-roboto',
  display: 'swap',
});

const robotoMono = localFont({
  src: [
    { path: '../../node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const viewport = {
  themeColor: '#FF2D78',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: {
    default: 'SPUNK',
    template: '%s · SPUNK',
  },
  description: 'Øvingsplan og rolleoversikt for Villekulla Ungdomsteater.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SPUNK',
  },
  icons: {
    apple: '/icons/icon-192.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" suppressHydrationWarning className={`${roboto.variable} ${robotoMono.variable}`}>
      <head />
      <body>
        <DynamicLayoutProviders>
          <ClientLayout>
            {children}
          </ClientLayout>
        </DynamicLayoutProviders>
      </body>
    </html>
  );
}
