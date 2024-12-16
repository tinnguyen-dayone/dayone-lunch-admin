import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/dashboard/overview", request.url));
}

export const config = {
  matcher: ["/"],
};
