"use client";
import CustomImage from "@components/CustomImage";
import Link from "next/link";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty } from "src/utils/helper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  A11y,
  Autoplay,
  Navigation,
  Scrollbar,
  Pagination as SwiperPagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ArtistSectionProps {
  artistData: any[];
}

export default function ArtistSection({ artistData }: ArtistSectionProps) {
  return (
    <div className="grid items-center justify-between gap-x-5 gap-y-10 px-6 sm:pt-10 md:grid-cols-2 lg:px-24">
      <div className="flex flex-col justify-center">
        <h3 className="heading-48 font-medium capitalize !leading-none text-black-200 md:text-3xl lg:text-4xl">
          Unlock The Art Of Entertainment
        </h3>
        <p className="mb-7 mt-5 text-grey-50 md:max-w-[55%]">
          Discover the finest talent to make your event extraordinary and
          memorable. Browse profiles, watch videos, and book with ease!
        </p>
        <Link
          href={ROUTES.client.artist}
          className="flex w-full items-center justify-center rounded-xl border border-customer-primary-100 px-14 py-3 text-customer-primary-100 transition-all duration-300 hover:bg-customer-primary-100 hover:text-white md:w-fit"
        >
          View All Artists
        </Link>
      </div>
      <div className="relative hidden items-center justify-center gap-4 xs:py-10 md:flex lg:pt-0">
        <>
          {!isEmpty(artistData?.[0]) ? (
            <div className="flex w-1/3 max-w-[190px] flex-col gap-2">
              <div className="h-[243px] w-full md:h-[180px] xl:h-[243px]">
                <CustomImage
                  src={convertMediaUrl(artistData?.[0]?.doc_path)}
                  alt="Artist Image"
                  height="100%"
                  width="100%"
                  className="!rounded-lg !object-cover"
                />
              </div>
              <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                {artistData?.[0]?.full_name}
              </p>
            </div>
          ) : null}
          {!isEmpty(artistData?.[1]) || !isEmpty(artistData?.[2]) ? (
            <div className="flex w-1/3 max-w-[190px] flex-col gap-4">
              {!isEmpty(artistData?.[1]) ? (
                <div className="flex flex-col gap-2">
                  <div className="h-[243px] w-full max-w-[190px] md:h-[180px] xl:h-[243px]">
                    <CustomImage
                      src={convertMediaUrl(artistData?.[1]?.doc_path)}
                      alt="Artist Image"
                      height="100%"
                      width="100%"
                      className="!rounded-lg !object-cover"
                    />
                  </div>
                  <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                    {artistData?.[1]?.full_name}
                  </p>
                </div>
              ) : null}
              {!isEmpty(artistData?.[2]) ? (
                <div className="flex flex-col gap-2">
                  <div className="h-[243px] w-full max-w-[190px] md:h-[180px] xl:h-[243px]">
                    <CustomImage
                      src={convertMediaUrl(artistData?.[2]?.doc_path)}
                      alt="Artist Image"
                      height="100%"
                      width="100%"
                      className="!rounded-lg !object-cover"
                    />
                  </div>
                  <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                    {artistData?.[2]?.full_name}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
          {!isEmpty(artistData?.[3]) || !isEmpty(artistData?.[4]) ? (
            <div className="relative flex w-1/3 max-w-[190px] flex-col gap-4 xs:top-20">
              {!isEmpty(artistData?.[3]) ? (
                <div className="flex flex-col gap-2">
                  <div className="h-[243px] w-full max-w-[190px] md:h-[180px] xl:h-[243px]">
                    <CustomImage
                      src={convertMediaUrl(artistData?.[3]?.doc_path)}
                      alt="Artist Image"
                      height="100%"
                      width="100%"
                      className="!rounded-lg !object-cover"
                    />
                  </div>
                  <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                    {artistData?.[3]?.full_name}
                  </p>
                </div>
              ) : null}
              {!isEmpty(artistData?.[4]) ? (
                <div className="flex flex-col gap-2">
                  <div className="h-[243px] w-full max-w-[190px] md:h-[180px] xl:h-[243px]">
                    <CustomImage
                      src={convertMediaUrl(artistData?.[4]?.doc_path)}
                      alt="Artist Image"
                      height="100%"
                      width="100%"
                      className="!rounded-lg !object-cover"
                    />
                  </div>
                  <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                    {artistData?.[4]?.full_name}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      </div>
      <Swiper
        spaceBetween={20}
        speed={700}
        slidesPerView={4}
        loop={true}
        modules={[Navigation, SwiperPagination, Scrollbar, A11y, Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          600: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 3,
          },
        }}
        className="eb-swiper w-full overflow-hidden md:!hidden"
      >
        <>
          {!isEmpty(artistData?.[0]) ? (
            <SwiperSlide>
              <div className="flex flex-col gap-2">
                <CustomImage
                  src={convertMediaUrl(artistData?.[0]?.doc_path)}
                  alt="Artist Image"
                  className="flex !h-[243px] min-w-full !max-w-[190px] justify-center rounded-lg object-cover md:!h-[180px] xl:!h-[243px]"
                />
                <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                  {artistData?.[0]?.full_name}
                </p>
              </div>
            </SwiperSlide>
          ) : null}
          <SwiperSlide>
            {!isEmpty(artistData?.[1]) ? (
              <div className="flex flex-col gap-2">
                <CustomImage
                  src={convertMediaUrl(artistData?.[1]?.doc_path)}
                  alt="Artist Image"
                  className="flex !h-[243px] min-w-full !max-w-[190px] justify-center rounded-lg object-cover md:!h-[180px] xl:!h-[243px]"
                />
                <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                  {artistData?.[1]?.full_name}
                </p>
              </div>
            ) : null}
          </SwiperSlide>
          <SwiperSlide>
            {!isEmpty(artistData?.[2]) ? (
              <div className="flex flex-col gap-2">
                <CustomImage
                  src={convertMediaUrl(artistData?.[2]?.doc_path)}
                  alt="Artist Image"
                  className="flex !h-[243px] min-w-full !max-w-[190px] justify-center rounded-lg object-cover md:!h-[180px] xl:!h-[243px]"
                />
                <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                  {artistData?.[2]?.full_name}
                </p>
              </div>
            ) : null}
          </SwiperSlide>
          <SwiperSlide>
            {!isEmpty(artistData?.[3]) ? (
              <div className="flex flex-col gap-2">
                <CustomImage
                  src={convertMediaUrl(artistData?.[3]?.doc_path)}
                  alt="Artist Image"
                  className="flex !h-[243px] !min-w-full !max-w-[190px] justify-center rounded-lg object-cover md:!h-[180px] xl:!h-[243px]"
                />
                <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                  {artistData?.[3]?.full_name}
                </p>
              </div>
            ) : null}
          </SwiperSlide>
          <SwiperSlide>
            {!isEmpty(artistData?.[4]) ? (
              <div className="flex flex-col gap-2">
                <CustomImage
                  src={convertMediaUrl(artistData?.[4]?.doc_path)}
                  alt="Artist Image"
                  className="flex !h-[243px] !min-w-full !max-w-[190px] justify-center rounded-lg object-cover md:!h-[180px] xl:!h-[243px]"
                />
                <p className="rounded-xl bg-green-400/20 px-2 py-4 text-center text-sm text-green-400 sm:text-base">
                  {artistData?.[4]?.full_name}
                </p>
              </div>
            ) : null}
          </SwiperSlide>
        </>
      </Swiper>
    </div>
  );
}
