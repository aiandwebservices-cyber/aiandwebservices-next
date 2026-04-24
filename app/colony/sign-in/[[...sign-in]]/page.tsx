import { SignIn } from '@clerk/nextjs';

export default function ColonySignIn() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#080d18' }}
    >
      <SignIn
        path="/colony/sign-in"
        fallbackRedirectUrl="/colony/dashboard"
        signUpUrl="/colony/sign-in"
      />
    </div>
  );
}
