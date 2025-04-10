// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// ✨ getToken 함수 임포트
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};

export async function middleware(request: NextRequest) {
  // --- ✨ getToken 함수 사용 ---
  // secret은 auth.ts 와 동일한 환경 변수 사용
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET!,
  });
  const { pathname } = request.nextUrl;

  console.log("[Middleware] Pathname:", pathname);
  // ✨ token 객체를 세션 정보로 사용
  console.log("[Middleware] Token:", token);

  // --- 1. 로그인 여부 확인 ---
  // ✨ token 객체의 존재 여부로 로그인 상태 확인
  const isLoggedIn = !!token;

  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/manager",
    "/worker",
    "/facility",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isLoggedIn) {
    console.log("[Middleware] Not logged in, redirecting to /login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- 2. 역할 기반 접근 제어 (로그인 된 사용자 대상) ---
  if (isLoggedIn && token) {
    // token이 null 이 아님을 확인
    // ✨ token 객체에서 역할 정보 가져오기 (jwt 콜백에서 넣은 값)
    const userRole = token.role;

    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      console.log("[Middleware] Access denied for /admin, role:", userRole);
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    if (
      pathname.startsWith("/manager") &&
      userRole !== "MANAGER" &&
      userRole !== "ADMIN"
    ) {
      console.log("[Middleware] Access denied for /manager, role:", userRole);
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    if (
      pathname.startsWith("/worker") &&
      userRole !== "WORKER" &&
      userRole !== "MANAGER" &&
      userRole !== "ADMIN"
    ) {
      console.log("[Middleware] Access denied for /worker, role:", userRole);
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
  }

  console.log("[Middleware] Allowed access to", pathname);
  return NextResponse.next();
}
