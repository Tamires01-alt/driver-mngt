import { auth } from "@/auth";
import { NextResponse } from "next/server";

const envSecret = process.env.API_SECRET;

var count = 0;

export default auth((req) => {
  const { pathname } = req.nextUrl;
  count++;
  console.log("Requests: ", count);

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
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|error|integracao|favicon.ico).*)",
  ],
};
