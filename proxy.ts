import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/server/auth";

const PUBLIC_ROUTES = [
	"/login",
	"/register",
	"/forgot-password",
	"/reset-password",
];

export async function proxy(request: NextRequest) {
	if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
		return NextResponse.next();
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		const loginUrl = new URL("/login", request.url);
		const error = request.nextUrl.searchParams.get("error");
		if (error) {
			loginUrl.searchParams.set("error", error);
		}

		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		{
			source: "/((?!_next|api/auth|sitemap.xml|robots.txt|.well-known/workflow|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).+)",
		},
	],
};
