"use client";
import { DownArrow } from "@assets/index";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ROUTES } from "src/utils/Constant";

const ScrollToTop = () => {
  const pathname = usePathname();
  const scrollToTopRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowScrollTop(true);
        scrollToTopRef.current?.classList.add("opacity-100");
      } else {
        setShowScrollTop(false);
        scrollToTopRef.current?.classList.remove("opacity-0");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {showScrollTop ? (
        <div
          ref={scrollToTopRef}
          tabIndex={0}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed ${pathname === ROUTES.home ? "bottom-20" : "bottom-8"} right-8 z-[999] flex size-8 rotate-180 cursor-pointer items-center justify-center rounded-md bg-green-400 p-2.5 text-center text-sm text-white opacity-0 transition-all duration-200 hover:scale-110`}
        >
          <DownArrow className="h-full min-h-full w-full min-w-full" />
        </div>
      ) : null}
    </>
  );
};

export default ScrollToTop;
