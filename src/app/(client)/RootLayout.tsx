"use client";
import ClientHeader from "@components/ClientHeader";
import Footer from "@components/Footer";
import { ScreenLoader } from "@components/Loader";
import { selectIsLoading } from "@redux/slices/utilSlice";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { jost } from "../global";
import "../global.css";

const ScrollToTop = dynamic(() => import("@components/ScrollToTop"), {
  ssr: true,
});

const TrendGalleryList = dynamic(() => import("@components/TrendGalleryList"), {
  ssr: true,
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const isLoading = useSelector(selectIsLoading);

  const pathname = usePathname();

  const [focusedPopover, setFocusedPopover] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <section
      className={`relative flex h-screen min-h-screen ${jost.className}`}
    >
      <div className="flex h-full w-full flex-1 flex-col justify-between">
        <div id="main-container" className="w-full flex-1">
          <ClientHeader
            focusedPopover={focusedPopover}
            setFocusedPopover={setFocusedPopover}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          <div>
            {isLoading && <ScreenLoader />}
            {children}
          </div>
          {!pathname.includes(`${ROUTES.client.trendGallery}/`) ? (
            <div className="flex flex-col gap-10 pt-10 md:gap-16 md:pt-16">
              {![
                ROUTES.privacyPolicy,
                ROUTES.termsConditions,
                ROUTES.disclaimer,
                ROUTES.client.compare,
                ROUTES.client.inbox,
                ROUTES.client.shortlists,
                ROUTES.client.trendGallery,
                ROUTES.client.educationalVideo,
                ROUTES.client.bazaarBuddy,
                ROUTES.client.ourStory,
                ROUTES.client.contactUs,
                ROUTES.client.faqs,
                ROUTES.client.careers,
                ROUTES.client.pr,
                ROUTES.client.blogs,
              ]?.find((v) => pathname?.includes(v)) ? (
                <TrendGalleryList />
              ) : null}

              <Footer
                setFocusedPopover={setFocusedPopover}
                setIsOpen={setIsOpen}
              />

              <ScrollToTop />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default RootLayout;
