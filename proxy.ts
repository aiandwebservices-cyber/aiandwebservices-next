import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isColonyRoute = createRouteMatcher(['/colony(.*)'])
const isPublicColonyRoute = createRouteMatcher([
  '/colony/sign-in(.*)',
  '/colony/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isColonyRoute(req) && !isPublicColonyRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
