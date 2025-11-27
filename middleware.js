import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
 
export async function middleware(request) {
	// Get session - works with both cookies and bearer tokens
	const session = await auth.api.getSession({
		headers: request.headers
	});
 
	if(!session) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
  runtime: "nodejs",
  matcher: [], // No routes protected by middleware - using client-side auth instead
};