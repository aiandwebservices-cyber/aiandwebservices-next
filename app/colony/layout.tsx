import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './colony.css'
import PostHogProvider from './components/PostHogProvider'
import ColonyShell from './components/ColonyShell'
import { SidePanelProvider } from './components/SidePanel'
import { CommandPaletteProvider } from './components/CommandPaletteProvider'

export const metadata: Metadata = {
  title: 'Colony — Live Operations',
  description: 'Operations dashboard for AI-powered small businesses',
}

export default function ColonyLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <PostHogProvider>
        <div className="colony-root" data-theme="dark" suppressHydrationWarning>
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
