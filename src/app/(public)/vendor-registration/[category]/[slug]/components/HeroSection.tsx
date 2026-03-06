import CustomImage from "@components/CustomImage";
import Link from "next/link";
import { ROUTES } from "src/utils/Constant";

interface HeroProps {
  heroData: {
    _id: number;
    title: React.ReactNode;
    image: string;
    button: string;
  };
}

const HeroStats = () => (
  <>
    <div className="absolute right-0 top-[30%] z-10 flex max-w-28 translate-x-[calc(50%-20px)] flex-col items-center justify-center rounded-[10px] border border-white-200 bg-white p-2 text-center md:gap-0.5 md:p-3">
      <p className="text-lg font-semibold text-green-800 sm:text-xl md:text-2xl">
        135+
      </p>
      <p className="text-12-500">Event Business Categories</p>
    </div>
    <div className="absolute bottom-[16%] left-0 z-10 flex max-w-28 -translate-x-[calc(50%-20px)] flex-col items-center justify-center rounded-[10px] border border-white-200 bg-white p-2 text-center md:gap-0.5 md:p-3">
      <p className="text-lg font-semibold text-green-800 sm:text-xl md:text-2xl">
        46+
      </p>
      <p className="text-12-500">Event Types</p>
    </div>
  </>
);

export default function HeroSection({ heroData }: HeroProps) {
  return (
    <div
      className="flex h-full gap-10 overflow-x-auto scroll-smooth px-10 md:px-20"
      style={{ scrollSnapType: "x mandatory" }}
    >
      <div
        key={heroData?._id}
        className="flex h-full w-full snap-center flex-col items-center gap-10 md:flex-row md:gap-20 lg:gap-36"
      >
        <div className="relative h-full w-full rounded-[20px] bg-green-400 bg-opacity-80 p-3 md:rounded-[30px] md:p-5 lg:p-8 xl:w-[50%]">
          <CustomImage
            src={heroData?.image}
            width="100%"
            height="100%"
            className="aspect-square rounded-[10px] object-cover md:rounded-[20px] lg:rounded-lg"
          />
          <HeroStats />
        </div>
        <div className="flex h-full w-full flex-col justify-between gap-[42px]">
          <h1 className="justify-center text-[8vw] font-bold leading-[10vw] sm:text-[4vw] sm:leading-[6vw]">
            {heroData?.title}
          </h1>

          <Link
            href={ROUTES.vendor.signUp}
            className="flex h-fit w-full items-center justify-center rounded-md border bg-green-400 px-11 py-3 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400 md:w-fit"
          >
            {heroData?.button}
          </Link>
        </div>
      </div>
    </div>
  );
}
