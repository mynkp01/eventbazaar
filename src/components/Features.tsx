"use client";
import { BriefcaseBusiness, BuildingIcon, CalenderIcon } from "@assets/index";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Featured = [
  {
    id: 0,
    title: 46,
    description: "Event Types",
    icon: CalenderIcon,
  },
  {
    id: 1,
    title: 136,
    description: "Business categories",
    icon: BriefcaseBusiness,
  },
  {
    id: 3,
    title: 6,
    description: "Cities",
    icon: BuildingIcon,
  },
] as const;

const FeaturesComponent = ({
  item,
  isVisible,
}: {
  item: (typeof Featured)[number];
  isVisible: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const increment = Math.ceil(item.title / (duration / 20));

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= item.title) {
          clearInterval(interval);
          return prev;
        }
        return Math.min(prev + increment, item.title);
      });
    }, 20);

    return () => clearInterval(interval);
  }, [item.title, isVisible]);

  return (
    <div className="flex w-[200px] items-center xs:mx-auto sm:justify-center lg:w-full">
      <div className="group flex w-fit items-center gap-2 p-5 lg:justify-center">
        <item.icon className="size-9 min-h-6 min-w-6 text-white transition-all duration-200 group-hover:scale-110" />

        <div>
          <p className="animate-fade-in text-2xl font-medium">{count}+</p>
          <p className="text-xs font-light md:text-sm">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 },
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [pathname]);

  return (
    <div
      key={`${pathname}-counter`}
      className="h-fit w-full bg-green-400 p-6 text-white lg:py-10"
    >
      <div
        ref={containerRef}
        className="flex flex-col divide-grey-200/30 xs:flex-row xs:divide-x lg:justify-center"
      >
        {Featured.map((item) => (
          <FeaturesComponent key={item.id} item={item} isVisible={isInView} />
        ))}
      </div>
    </div>
  );
};

export default Features;
