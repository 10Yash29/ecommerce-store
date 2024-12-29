import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)", // Public Sign-In route
    "/sign-up(.*)", // Public Sign-Up route
    "/products(.*)", // Allow product browsing
]);

export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        "/((?!.*\\.(?:html|css|js|json|svg|png|jpg|jpeg|gif|ico)).*)",
    ],
};
