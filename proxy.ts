import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function proxy(request: NextRequest) {
  if (process.env.COMING_SOON !== "true") {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/landing") {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/landing", request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
