import { ClerkProvider } from '@clerk/nextjs';

// ClerkProvider is scoped to dealer admin routes only.
// Static dealer routes (lotcrm, sunshine-motors) override this with dealer-specific
// signInUrl props; this fallback serves any dynamically-added dealer.
export default function DealerAdminLayout({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
