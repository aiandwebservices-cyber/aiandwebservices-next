import { ClerkProvider } from '@clerk/nextjs'

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>
}
