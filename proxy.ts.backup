import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isColonyRoute = createRouteMatcher(['/colony(.*)']);
const isPublicColonyRoute = createRouteMatcher([
  '/colony/sign-in(.*)',
  '/colony/unauthorized',
]);

const ALLOWED_COHORT_IDS = (process.env.COLONY_ALLOWED_COHORT_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const proxy = clerkMiddleware(async (auth, req) => {
  if (!isColonyRoute(req)) return;
  if (isPublicColonyRoute(req)) return;

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    const signInUrl = new URL('/colony/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (ALLOWED_COHORT_IDS.length > 0) {
    const cohortId = (sessionClaims?.publicMetadata as Record<string, unknown>)
      ?.cohort_id as string | undefined;
    if (!cohortId || !ALLOWED_COHORT_IDS.includes(cohortId)) {
      return NextResponse.redirect(new URL('/colony/unauthorized', req.url));
    }
  }
});

export const config = {
  matcher: ['/colony(.*)'],
};
