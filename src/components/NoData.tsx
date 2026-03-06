"use client";
import { NoData as NoDataIcon, ShareIcon } from "@assets/index";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ROUTES } from "src/utils/Constant";

const SocialMediaShareModal = dynamic(
  () => import("@components/SocialMediaShareModal"),
  {
    ssr: true,
  },
);

const NoData = ({
  text = "Oops! No data found",
  isTextOnly = false,
  isFromVendorList = false,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center gap-5 py-5">
      {!isTextOnly ? <NoDataIcon className="size-40" /> : null}
      {isFromVendorList ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center">
            {" "}
            Know someone who fits this category? Invite them to join <br />
            <Link
              href={process.env.NEXT_PUBLIC_FRONTEND_URL}
              className="text-green-400"
              target="_blank"
            >
              EventBazaar.com
            </Link>
            .
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.vendor.signUp}
              target="_blank"
              className="flex h-12 w-fit items-center justify-center rounded-md border bg-green-400 px-10 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
            >
              Sign-up now
            </Link>
            <button
              onClick={() => setShowShareModal(true)}
              className="group flex size-12 items-center justify-center rounded-md border bg-green-400 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
            >
              <ShareIcon className="size-5 text-white group-hover:text-green-400" />
            </button>
            <SocialMediaShareModal
              url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}${ROUTES.vendor.signUp}`}
              visible={showShareModal}
              setVisible={setShowShareModal}
            />
          </div>
        </div>
      ) : (
        <p className="heading-40 w-full text-center font-bold capitalize text-gray-400 md:w-1/2">
          {text}
        </p>
      )}
    </div>
  );
};

export default NoData;
