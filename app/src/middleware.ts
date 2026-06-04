import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
	return new NextResponse("Authentication required", {
		status: 401,
		headers: {
			"WWW-Authenticate": 'Basic realm="Preview"',
		},
	});
}

export function middleware(request: NextRequest) {
	if (process.env.BASIC_AUTH_ENABLED !== "true") {
		return NextResponse.next();
	}

	const path = request.nextUrl.pathname;
	const passthroughPaths = ["/api/health", "/favicon.ico", "/robots.txt", "/sitemap.xml"];
	const isBypass =
		passthroughPaths.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)) ||
		path.startsWith("/_next/") ||
		path.startsWith("/static/") ||
		path.startsWith("/images/");

	if (isBypass) {
		return NextResponse.next();
	}

	const authHeader = request.headers.get("authorization");
	if (!authHeader?.startsWith("Basic ")) {
		return unauthorized();
	}

	const base64Credentials = authHeader.slice(6);
	const expected = `${process.env.BASIC_AUTH_USERNAME ?? ""}:${process.env.BASIC_AUTH_PASSWORD ?? ""}`;
	let decoded = "";
	try {
		decoded = atob(base64Credentials);
	} catch {
		return unauthorized();
	}

	if (!expected || decoded !== expected) {
		return unauthorized();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/:path*"],
};
