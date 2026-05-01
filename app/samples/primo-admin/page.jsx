import { redirect } from 'next/navigation';

/**
 * Old sample route — redirects to the new dealer-platform route.
 * The original 7,000-line monolith lives at page.original.jsx.txt for reference;
 * its working logic has been refactored into lib/dealer-platform/admin/AdminPanel.jsx,
 * which is now invoked by app/dealers/primo/admin/page.jsx.
 */
export default function PrimoAdminRedirect() {
  redirect('/dealers/primo/admin');
}
