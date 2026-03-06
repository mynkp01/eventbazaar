"use client";
import { ScreenLoader } from "@components/Loader";
import { selectIsLoading } from "@redux/slices/utilSlice";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useSelector } from "react-redux";
import "../../global.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isLoading = useSelector(selectIsLoading);

  return (
    <div>
      <GoogleReCaptchaProvider
        reCaptchaKey={
          process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "NOT DEFINED"
        }
        scriptProps={{
          async: true,
          defer: true,
          appendTo: "head",
          nonce: undefined,
        }}
      >
        {isLoading && <ScreenLoader />}
        {children}
      </GoogleReCaptchaProvider>
    </div>
  );
}
