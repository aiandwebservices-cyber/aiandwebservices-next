import { ClerkProvider } from '@clerk/nextjs'

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>
}
