import { 
    clerkMiddleware,
    createRouteMatcher
 } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/site",
    "/api/uploadthing"
])

export default clerkMiddleware((auth,req) => {
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    const hostname = req.headers;

    const pathnameWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` :"" }`;

    const customSubDomain = hostname.get("host")?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0]

    if(customSubDomain){
        const newUrl = `/${customSubDomain}${pathnameWithSearchParams}`;
        return NextResponse.rewrite(new URL(newUrl,req.url))
    }

    if(url.pathname === "/sign-in" || url.pathname === "/sign-up"){
        return NextResponse.rewrite(new URL("/agency/sign-in",req.url))
    }

    if(url.pathname === "/" || url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN){
        return NextResponse.rewrite(new URL("/site",req.url));
    }
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  };