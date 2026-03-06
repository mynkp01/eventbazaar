"use client";
import { apiHandler } from "@api/apiHandler";
import CloseIcon from "@mui/icons-material/Close";
import { logout, selectAdminUser, selectUser } from "@redux/slices/authSlice";
import { selectIsLoading, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import "ckeditor5/ckeditor5.css";
import Cookies from "js-cookie";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ROUTES, USER_TYPES } from "src/utils/Constant";
import { isEmpty } from "src/utils/helper";
import "./global.css";

export function Canonicals({}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      apiHandler.utils.getIp();
    } catch (error) {
      console.error("error get-IP", error);
    }
  }, []);

  return (
    <>
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}${pathname}${searchParams?.toString() ? `?${searchParams?.toString()}` : ""}`}
      />
      <style>
        {`#dt-chatButton {
            display: ${pathname === ROUTES.home ? "" : "none"};
            z-index: 998;
            }`}
      </style>
    </>
  );
}
export function ToastContainerComp() {
  return (
    <ToastContainer
      stacked
      closeButton={({ closeToast }) => (
        <i className="material-icons flex items-center" onClick={closeToast}>
          <CloseIcon />
        </i>
      )}
    />
  );
}

let isLoadingTimeout;
export default function ClientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);
  const adminData = useSelector(selectAdminUser);
  const isLoading = useSelector(selectIsLoading);

  const isHandlingNavigation = useRef(false);

  useEffect(() => {
    if (isLoadingTimeout && !isLoading) clearTimeout(isLoadingTimeout);

    if (isLoading)
      isLoadingTimeout = setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 5000);

    return () => {
      if (isLoadingTimeout) clearTimeout(isLoadingTimeout);
    };
  }, [isLoading]);

  useEffect(() => {
    const isAdminPath = pathname.startsWith("/admin/");
    const isVendorPath = pathname.startsWith("/vendor/");
    const isAdmin =
      !isEmpty(adminData) && adminData?.user_type === USER_TYPES.ADMIN;
    const isVendor =
      !isEmpty(userData) && userData?.user_type === USER_TYPES.VENDOR;

    if (
      !isAdminPath &&
      !isVendorPath &&
      isAdmin &&
      isVendor &&
      !isHandlingNavigation.current
    ) {
      isHandlingNavigation.current = true;

      const confirmed = confirm(
        "Leaving vendor's dashboard will log you out. Continue?",
      );
      if (confirmed) {
        dispatch(logout());
        Cookies.remove("token");
        Cookies.remove("user_type");
      } else {
        router.back();
      }
      setTimeout(() => {
        isHandlingNavigation.current = false;
      }, 100);
    }
  }, [adminData, dispatch, pathname, router, userData]);

  return children;
}
