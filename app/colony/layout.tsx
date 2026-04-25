import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './colony.css'
import PostHogProvider from './components/PostHogProvider'
import ColonyShell from './components/ColonyShell'
import { SidePanelProvider } from './components/SidePanel'
import { CommandPaletteProvider } from './components/CommandPaletteProvider'
import ImpersonationBanner from './components/ImpersonationBanner'

export const viewport: Viewport = {
  themeColor: '#3787E6',
}

export const metadata: Metadata = {
  title: 'Colony — Live Operations',
  description: 'Operations dashboard for AI-powered small businesses',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Colony',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
  },
  formatDetection: {
    telephone: false,
  },
}

export default function ColonyLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <PostHogProvider>
        <div className="colony-root" data-theme="dark" suppressHydrationWarning>
          <ImpersonationBanner />
          <SidePanelProvider>
            <CommandPaletteProvider>
              <ColonyShell>{children}</ColonyShell>
            </CommandPaletteProvider>
          </SidePanelProvider>
        </div>
      </PostHogProvider>
    </ClerkProvider>
  )
}
