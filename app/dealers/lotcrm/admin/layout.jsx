import { ClerkProvider } from '@clerk/nextjs';

export default function LotcrmAdminLayout({ children }) {
  return (
    <ClerkProvider
      signInUrl="/dealers/lotcrm/admin"
      signUpUrl="/dealers/lotcrm/admin"
      signInFallbackRedirectUrl="/dealers/lotcrm/admin"
      signUpFallbackRedirectUrl="/dealers/lotcrm/admin"
    >
      {children}
    </ClerkProvider>
  );
}
