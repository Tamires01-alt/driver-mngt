import { auth } from "@/auth";
import { NextResponse } from "next/server";

const envSecret = process.env.SECRET;

export default function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) {
    const secret = req.headers.get("x-api-secret");

    if (secret !== envSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    return NextResponse.next();
  }

  if (!req.auth && pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|interno|error|integracao|favicon.ico).*)",
  ],
};
