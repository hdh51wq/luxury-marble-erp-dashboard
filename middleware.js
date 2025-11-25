import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
 
export async function middleware(request) {
	// Get session from cookies (better-auth automatically handles this)
	const session = await auth.api.getSession({
		headers: request.headers
	})
 
	if(!session) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
  runtime: "nodejs",
  matcher: ["/"], // Protect dashboard route
};