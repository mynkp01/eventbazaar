"use client";
import { Logo } from "@assets/index";
import { selectUser } from "@redux/slices/authSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";

const HoldOnTight = () => {
  const userData = useSelector(selectUser);

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDisabled(false);
    }, 60000);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-[99999] flex h-full w-full flex-col items-center justify-center gap-6 bg-primary-100 p-5">
      <Logo className="h-10" />
      <h1 className="max-w-xs text-center text-3xl font-semibold text-primary-800 sm:max-w-md sm:text-4xl">
        Registration Complete Hold on tight!!
      </h1>
      <div className="flex flex-col gap-4">
        <p className="text-14-600 text-center font-semibold text-primary-500">
          This might take a few minutes! We are creating a personalized space
          just for you.
        </p>
        <p className="text-14-600 text-center font-semibold text-primary-500">
          <Link
            href={disabled ? "" : `${ROUTES.vendor.subscriptions}`}
            className="text-blue-100 underline"
          >
            Click here
          </Link>{" "}
          if you are not redirected to your dashboard within 60 seconds.
        </p>
      </div>
    </div>
  );
};

export default HoldOnTight;
