import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--colony-bg-chrome)' }}>
      <SignUp />
    </div>
  )
}
