import { Oswald, Inter, JetBrains_Mono } from 'next/font/google';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Primo Auto Group — Sample Site',
  robots: { index: false, follow: false },
};

export default function Example005Layout({ children }) {
  return (
    <div className={`${oswald.variable} ${inter.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
