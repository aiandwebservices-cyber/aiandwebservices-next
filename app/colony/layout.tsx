import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { PHProvider } from '@/components/colony/PostHogProvider';
import { ThemeProvider } from '@/components/colony/ThemeProvider';
import './colony.css';

export const metadata: Metadata = {
  title: 'Colony — AIandWEBservices',
  description: 'Your AI business dashboard',
  robots: 'noindex, nofollow',
};

export default function ColonyLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <PHProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </PHProvider>
    </ClerkProvider>
  );
}
