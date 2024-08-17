import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const authMiddleware = ({
  publicRoutes: ["/", "/api/webhook"],
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};