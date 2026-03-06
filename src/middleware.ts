import CryptoJS from "crypto-js";
import { NextRequest, NextResponse } from "next/server";
import { ROUTES, USER_TYPES } from "./utils/Constant";

const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const iv = process.env.NEXT_PUBLIC_IV_KEY;

const decrypt = (encryptedData) => {
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Hex.parse(encryptedData) },
    CryptoJS.enc.Hex.parse(key),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = req.cookies.get("token");
  const adminToken = req.cookies.get("admin_token");
  const userType = req.cookies.get("user_type");
  const adminUserType = req.cookies.get("admin_user_type");

  const isAdmin = path.includes("/admin");

  const isAuthenticated = isAdmin
    ? decrypt(adminToken?.value || "")
    : decrypt(token?.value || "");
  const user_type = decrypt(userType?.value || "");
  const admin_user_type = decrypt(adminUserType?.value || "");

  if (
    ROUTES.unprotectedUrlsList.includes(path) ||
    ROUTES.unprotectedDynamicUrlsList.find((v) => path.includes(v))
  ) {
    return NextResponse.next();
  }

  if (path.startsWith("/admin/")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(ROUTES.admin.signIn, req.url));
    }

    if (ROUTES.adminAllowed.includes(path) && !admin_user_type) {
      return NextResponse.next();
    }

    if (isAuthenticated && !admin_user_type) {
      return NextResponse.redirect(new URL(ROUTES.admin.signIn, req.url));
    }

    if (
      isAuthenticated &&
      admin_user_type === USER_TYPES.ADMIN &&
      ROUTES.adminAllowed.includes(path)
    ) {
      return NextResponse.redirect(new URL(ROUTES.admin.dashboard, req.url));
    }
  }

  if (path.startsWith("/vendor/")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(ROUTES.vendor.signIn, req.url));
    }

    if (
      ROUTES.vendorAllowed.includes(path) &&
      user_type !== USER_TYPES.VENDOR
    ) {
      return NextResponse.next();
    }

    if (
      isAuthenticated &&
      user_type !== USER_TYPES.VENDOR &&
      !admin_user_type
    ) {
      return NextResponse.redirect(new URL(ROUTES.vendor.signIn, req.url));
    }

    if (
      isAuthenticated &&
      user_type === USER_TYPES.VENDOR &&
      ROUTES.vendorAllowed.includes(path)
    ) {
      return NextResponse.redirect(new URL(ROUTES.vendor.dashboard, req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
