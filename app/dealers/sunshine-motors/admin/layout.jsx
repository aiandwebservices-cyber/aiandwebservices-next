import { ClerkProvider } from '@clerk/nextjs';

export default function SunshineAdminLayout({ children }) {
  return (
    <ClerkProvider
      signInUrl="/dealers/sunshine-motors/admin"
      signUpUrl="/dealers/sunshine-motors/admin"
      signInFallbackRedirectUrl="/dealers/sunshine-motors/admin"
      signUpFallbackRedirectUrl="/dealers/sunshine-motors/admin"
    >
      {children}
    </ClerkProvider>
  );
}
