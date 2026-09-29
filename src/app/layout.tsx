import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BazaarPulse — Centralized Sales & Discount Aggregator for Pakistani Brands',
  description:
    'Discover live verified discounts and sales across leading Pakistani clothing brands including Sapphire, Outfitters, Khaadi, J., Gul Ahmed, Nishat Linen, Sana Safinaz, Bachaa Party and more.',
  keywords: [
    'Pakistani clothing sales',
    'Sapphire sale',
    'Outfitters discounts',
    'Khaadi unstitched lawn sale',
    'Junaid Jamshed kurta sale',
    'Pakistani fashion aggregator',
    'Gul Ahmed Ideas clearance',
    'Nishat Linen flat 50',
    'Bachaa Party kids sale',
    'BazaarPulse',
  ],
  authors: [{ name: 'BazaarPulse Engine' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAFAFC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background text-slate-100 antialiased selection:bg-brand-emerald selection:text-black">
        {children}
      </body>
    </html>
  );
}
