import { redirect } from 'next/navigation';

/**
 * Old sample route — redirects to the new dealer-platform route.
 * The original 5,300-line monolith lives at page.original.jsx.txt for reference;
 * its working logic has been refactored into lib/dealer-platform/customer/CustomerSite.jsx,
 * which is now invoked by app/dealers/primo/page.jsx.
 */
export default function Example005Redirect() {
  redirect('/dealers/primo');
}
