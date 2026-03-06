"use client";
import { landingBackgroundGradient, Logo } from "@assets/index";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ROUTES } from "src/utils/Constant";

const PublicHeader = () => {
  const route = useRouter();

  const sidebarRef = useRef(null);

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos === 0) {
        setVisible(true);
        return;
      }

      const isScrollingDown = prevScrollPos < currentScrollPos;

      setVisible(!isScrollingDown);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <div
      id="client-header"
      className={`sticky top-0 z-[1200] w-full transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="w-full">
        <div
          style={{ backgroundImage: `url(${landingBackgroundGradient.src})` }}
          className="h-fit w-full bg-cover bg-center bg-no-repeat"
        >
          <div className="flex h-full w-full justify-end gap-2.5 py-2 xxs:px-6 xs:px-0 md:items-center md:px-6 lg:px-24">
            <p className="text-16-400 !font-light text-customer-primary-100">
              Looking for Customer Portal ?{" "}
              <Link href={ROUTES.home} className="text-16-600">
                Click here
              </Link>
            </p>
          </div>
        </div>

        <div className="flex w-full items-center bg-customer-secondary-100 xxs:px-6 xs:px-0 md:px-6 md:pb-0 lg:px-24">
          <div className="flex h-20 w-full items-center justify-between gap-1">
            <Link href={ROUTES.landingPage}>
              <Logo height={36} />
            </Link>

            <div className="hidden gap-2 md:flex">
              <Link
                href={ROUTES.vendor.signIn}
                className="rounded-lg border border-customer-primary-100 bg-transparent px-3 py-1 text-[12px] text-customer-primary-100 transition-all duration-300 hover:!border-customer-primary-100 hover:!bg-customer-primary-100 hover:!text-primary-200 sm:px-3 sm:py-2 sm:text-sm"
              >
                Vendor Login
              </Link>
              <Link
                href={ROUTES.vendor.signUp}
                className="rounded-lg border bg-customer-primary-100 px-3 py-1 text-[12px] text-white transition-all duration-300 hover:!border-customer-primary-100 hover:!bg-transparent hover:!text-customer-primary-100 sm:px-3 sm:py-2 sm:text-sm"
              >
                Vendor Signup
              </Link>
            </div>
          </div>

          <div ref={sidebarRef}>
            <div className="flex h-[1px] bg-customer-primary-100 bg-opacity-10 md:hidden" />
            <div className="gap-2 py-3 xs:flex sm:px-12 md:hidden">
              <button
                onClick={() => route.push(ROUTES.vendor.signIn)}
                className="w-full rounded-lg border border-customer-primary-100 bg-transparent px-1 py-1.5 text-[10px] text-customer-primary-100 transition-all duration-300 hover:!border-customer-primary-100 hover:!bg-customer-primary-100 hover:!text-primary-200 sm:px-3 sm:text-sm"
              >
                Vendor Login
              </button>
              <button
                onClick={() => route.push(ROUTES.vendor.signUp)}
                className="w-full rounded-lg border bg-customer-primary-100 px-1 py-2 text-[10px] text-white transition-all duration-300 hover:!border-customer-primary-100 hover:!bg-transparent hover:!text-customer-primary-100 sm:px-3 sm:text-sm"
              >
                Vendor Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicHeader;
