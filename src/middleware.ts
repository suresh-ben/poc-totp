import { NextResponse, NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
    //current path
    const headers = new Headers(request.headers);
    headers.set("x-current-path", request.nextUrl.pathname);

    return NextResponse.next({ headers });
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};