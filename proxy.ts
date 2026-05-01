import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isColonyRoute = createRouteMatcher(['/colony(.*)'])
const isPublicColonyRoute = createRouteMatcher([
  '/colony/sign-in(.*)',
  '/colony/sign-up(.*)',
])

// Admin page routes: /dealers/<id>/admin and sub-paths
const isDealerAdminPage = createRouteMatcher(['/dealers/:dealerId/admin(.*)'])
// Admin API routes: always hard-protected server-side (no demo bypass)
const isDealerAdminApi = createRouteMatcher(['/api/dealer/:dealerId/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Colony — protect all except sign-in/sign-up
  if (isColonyRoute(req) && !isPublicColonyRoute(req)) {
    await auth.protect()
  }

  // Dealer admin API — always requires a valid Clerk session
  if (isDealerAdminApi(req)) {
    await auth.protect()
  }

  // Dealer admin pages — requires auth unless ?demo=true on the primo dealer
  if (isDealerAdminPage(req)) {
    const url = req.nextUrl
    const isDemo =
      url.searchParams.get('demo') === 'true' &&
      url.pathname.startsWith('/dealers/primo/admin')
    if (!isDemo) {
      await auth.protect()
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
