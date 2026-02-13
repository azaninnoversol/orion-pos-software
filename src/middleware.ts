// next
import { NextRequest, NextResponse } from "next/server";

const roleBasedRoutes: Record<string, string[]> = {
  admin: ["/dashboard", "/menu", "/staff-manage", "/branches-manage", "/customers", "/reports", "/my-account", "/reset-password"],
  manager: ["/dashboard", "/menu", "/staff-manage", "/branches-manage", "/customers", "/reports", "/my-account", "/reset-password"],
  cashier: ["/cashier/dashboard", "/cashier/pos", "/cashier/customers", "/cashier/orders", "/my-account", "/cashier/shift-manage", "/reset-password"],
  kitchen: ["/kitchen/dashboard", "/reset-password", "/my-account"],
  guest: ["/reset-password"],
};

const defaultDashboard: Record<string, string> = {
  manager: "/dashboard",
  admin: "/dashboard",
  cashier: "/cashier/dashboard",
  kitchen: "/kitchen/dashboard",
  guest: "/login",
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("TOKEN")?.value;
  const role = request.cookies.get("USER_ROLE")?.value || "guest";
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/", "/login", "/signup", "/reset-password"];
  const allowedRoutes = roleBasedRoutes[role] || [];
  const redirectDashboard = defaultDashboard[role] || "/login";

  if (publicRoutes.includes(pathname)) {
    if (token) return NextResponse.redirect(new URL(redirectDashboard, request.url));
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!hasAccess) {
    return NextResponse.redirect(new URL(redirectDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard",
    "/staff-manage",
    "/branches-manage",
    "/branches-manage/:path*",
    "/menu",
    "/customers",
    "/reports",
    "/cashier/dashboard",
    "/cashier/pos",
    "/cashier/customers",
    "/my-account",
    "/cashier/shift-manage",
    "/reset-password",
    "/kitchen/dashboard",
  ],
};
