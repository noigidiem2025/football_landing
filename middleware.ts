import { NextResponse, type NextRequest } from "next/server";

const lp2Hostnames = (process.env.LP2_HOSTNAMES ?? "")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

function normalizeHost(host: string | null) {
  return (host ?? "").split(":")[0]?.toLowerCase() ?? "";
}

function isAssetOrFrameworkPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = normalizeHost(request.headers.get("host"));
  const isLp2Host = lp2Hostnames.includes(host);
  const isLp2PreviewPath = pathname === "/landing-2" || pathname === "/landing-2/";

  if (!isLp2Host && !isLp2PreviewPath) {
    return NextResponse.next();
  }

  if (isAssetOrFrameworkPath(pathname) || pathname.startsWith("/lp2")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/lp2/index.html";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
