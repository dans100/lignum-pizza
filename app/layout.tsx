import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Nav from '@/components/Nav';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Lignum Pizzas',
  description: 'The best italian pizzas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <main>
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}
