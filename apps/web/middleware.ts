import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only the (app) routes require auth. The marketing page, /api/scan, and
// /api/pair/redeem stay public.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/circle(.*)",
  "/settings(.*)",
  "/extension/activate(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
