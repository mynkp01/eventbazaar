"use client";
import { Checkbox, FormControlLabel, Radio, styled } from "@mui/material";
import { store } from "@redux/store/store";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastOptions } from "react-toastify";
import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";
import { VIDEO_URL } from "./Constant";

const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const iv = process.env.NEXT_PUBLIC_IV_KEY;

export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === "object") {
    return Object.keys(value as object).length === 0;
  }
  return false;
};

const defaultToastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const useSidebarState = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const sidebar = document.getElementById("sidebar");

    const checkSidebarState = () => {
      if (sidebar) {
        setIsSidebarOpen(sidebar.classList.contains("lg:w-full"));
      }
    };

    checkSidebarState();
    const observer = new MutationObserver(checkSidebarState);
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => observer.disconnect();
  }, []);

  return isSidebarOpen;
};

export const showToast = (
  type: "success" | "error" | "info" | "warning" | "default",
  content: string | React.ReactNode,
  options: ToastOptions = {},
): void => {
  const toastOptions = { ...defaultToastOptions, ...options };

  switch (type) {
    case "success":
      toast.success(content, toastOptions);
      break;
    case "error":
      toast.error(content, toastOptions);
      break;
    case "info":
      toast.info(content, toastOptions);
      break;
    case "warning":
      toast.warning(content, toastOptions);
      break;
    default:
      toast(content, toastOptions);
  }
};

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  "@media (max-width: 600px)": {
    "& .MuiSvgIcon-root": {
      fontSize: "20px !important",
    },
  },
  "& .MuiSvgIcon-root": {
    fontSize: 26,
  },
  "&.Mui-checked .MuiSvgIcon-root": {
    fontSize: 26,
    color: "#2A85FF",
  },
}));

export const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  "& .MuiTypography-root": {
    fontFamily: '"Inter", sans-serif',
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: "24px",
    letterSpacing: "-0.14px",
    color: "#1A1D1F",
  },
  "@media (max-width: 600px)": {
    "& .MuiTypography-root": {
      fontSize: "12px",
    },
  },
}));

export const StyledRadio = styled(Radio)(({ theme }) => ({
  "@media (max-width: 600px)": {
    "&.MuiSvgIcon-root": {
      fontSize: "18 !important",
    },
  },
  "& .MuiSvgIcon-root": {
    fontSize: 24,
  },
  "&.MuiRadio-root": {
    color: "#1D1B20",
  },
  "&.Mui-checked": {
    color: "#2A85FF",
  },
}));

export const encrypt = (data) => {
  const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(key), {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
};

export const decrypt = (encryptedData) => {
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

export const validateGSTNumberRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const validatePANNumberRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;

export const validateDomainRegex =
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

export const validateWebsiteRegex =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/;

export const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const showPopup = (
  type: SweetAlertIcon,
  title?: string | HTMLElement | JQuery,
  options: SweetAlertOptions & {
    onClickConfirm?: () => void;
    onClickDeny?: () => void;
  } = {},
  showCancelButton: boolean = false,
  confirmButtonText: string = "Ok",
  denyButtonText: string = "Cancel",
): void => {
  const handlePopState = () => {
    Swal.close();
  };

  window.addEventListener("popstate", handlePopState);

  Swal.fire({
    title,
    icon: type,
    confirmButtonText,
    showCancelButton,
    denyButtonText,
    customClass: {
      ...options?.customClass,
      title: `text-base md:text-lg font-medium ${options?.customClass?.title || ""}`,
      confirmButton: `bg-blue-300 rounded-lg ${options?.customClass?.confirmButton || ""}`,
      cancelButton: `rounded-lg bg-primary-400 ${options?.customClass?.cancelButton || ""}`,
      denyButton: `rounded-lg ${options?.customClass?.denyButton || ""}`,
    },
    showClass: {
      ...options?.showClass,
      popup: `!z-[9999999999999] rounded-xl ${options?.showClass?.popup || ""}`,
    },
    ...options,
  }).then((res) => {
    window.removeEventListener("popstate", handlePopState);

    if (res.isConfirmed && options.onClickConfirm) {
      options.onClickConfirm();
    }
    if (res.isDenied && options.onClickDeny) {
      options.onClickDeny();
    }
  });
};

export const showNotFoundPage = (condition: boolean = true) => {
  if (condition) {
    return notFound();
  }
};

export const showLogoutConfirmationWhileOverrideInfo = (
  userType?: string,
  onClickLogout?: () => void,
) => {
  showPopup(
    "error",
    `<p class="!text-base !font-medium">You will logged out as <strong class="capitalize">${userType} !!</strong></p>`,
    {
      confirmButtonText: "Logout",
      customClass: {
        confirmButton: "bg-red-500",
        popup: "z-[1500]",
        container: "z-[1500]",
      },
      onClickConfirm: onClickLogout,
      showCancelButton: true,
      focusConfirm: true,
      stopKeydownPropagation: true,
      allowEscapeKey: true,
    },
  );
};

export function convertToIndianWords(amount: string | number) {
  const price = Number(amount);

  const formatNumber = (num: number) => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(1);
  };

  if (price >= 1000000000000) {
    return `${formatNumber(price / 1000000000000)} Trillion`;
  }
  if (price >= 10000000000) {
    return `${formatNumber(price / 10000000000)} Thousand Crore`;
  }
  if (price >= 1000000000) {
    return `${formatNumber(price / 1000000000)} Hundred Crore`;
  }
  if (price >= 10000000) {
    return `${formatNumber(price / 10000000)} Crore`;
  }
  if (price >= 100000) {
    return `${formatNumber(price / 100000)} Lakh`;
  }
  if (price >= 1000) {
    return `${formatNumber(price / 1000)} Thousand`;
  }

  return price.toString();
}

export const generateValueCode = (value: string) => {
  return value
    .toUpperCase()
    .replace(/[^a-zA-Z\s]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
};

export const checkCurrentSelectedTabPermission = (valueCode?: string) => {
  const permission = store.getState().auth.permissions;
  const currentSelectedTab = decrypt(Cookies.get("opn") || "");

  return permission?.find((p) => p?.module?.value_code === currentSelectedTab)
    ?.permissions;
};
export function convertMediaUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_MINIO_URL || process.env.NEXT_PUBLIC_BACKEND_API}${path || ""}`;
}

export const convertVideoUrl = (docPath: string) => {
  return `${process.env.NEXT_PUBLIC_BACKEND_API}${VIDEO_URL}${docPath}`;
};

export const isValidObjectId = (id: string): boolean => {
  return objectIdRegex.test(id);
};

export const skipObjectId = (slug: string): string => {
  return slug
    ?.split(/[- ]+/)
    ?.filter((_) => !objectIdRegex.test(_))
    ?.join("-");
};

export const getObjectIdFromString = (slug: string): string => {
  return (
    slug
      ?.split(/[- ]+/)
      ?.find((_) => objectIdRegex.test(_))
      ?.toString() || ""
  );
};

export const isAdminRoute = () => {
  return window.location.pathname.includes("/admin");
};

export const copyToClipboard = async (text: string = ""): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }

    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  } catch (err) {
    return false;
  }
};
