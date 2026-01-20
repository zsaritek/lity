import type { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '@/app/ThemeRegistry';
import SessionProvider from '@/components/SessionProvider';
import Navbar from '@/components/Navbar';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

export const metadata: Metadata = {
  title: 'Lity - Blog Platform',
  description: 'A modern blog platform built with Next.js, Material-UI, and Prisma',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitColorSchemeScript defaultMode="light" />
      </head>
      <body>
        <SessionProvider>
          <ThemeRegistry>
            <Navbar />
            {children}
          </ThemeRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
