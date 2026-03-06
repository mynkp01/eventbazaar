"use client";
import { apiHandler } from "@api/apiHandler";
import { VideoPlayerIcon } from "@assets/index";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  A11y,
  Navigation,
  Scrollbar,
  Pagination as SwiperPagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CustomImage from "./CustomImage";

const TrendGalleryList = () => {
  const [trendGalleryData, setTrendGalleryData] = useState([]);

  useEffect(() => {
    fetchTrendGallery();
  }, []);

  const fetchTrendGallery = async () => {
    try {
      const { data, status } = await apiHandler.trendGallery.list();
      if (status === 200 || status === 201) {
        setTrendGalleryData(data?.data?.records);
      }
    } catch (error) {
      showToast("error", error?.message);
    }
  };

  return !isEmpty(trendGalleryData) ? (
    <div className="flex flex-col gap-4 px-6 lg:gap-6 lg:px-24 xl:gap-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row lg:gap-6 xl:gap-8">
        <div>
          <p className="heading-40">Trend Gallery</p>
        </div>
        <Link
          href={ROUTES.client.trendGallery}
          className="flex w-full items-center justify-center whitespace-nowrap rounded-full border border-green-500 px-6 py-2 text-green-500 transition-all hover:bg-green-400 hover:text-white md:w-auto"
        >
          View All
        </Link>
      </div>

      <div>
        <Swiper
          spaceBetween={20}
          speed={700}
          slidesPerView={4}
          modules={[Navigation, SwiperPagination, Scrollbar, A11y]}
          loop
          navigation
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
          className="eb-swiper w-full overflow-hidden"
        >
          {trendGalleryData.map((i) => (
            <SwiperSlide key={i?._id} className="group">
              <Link
                className="flex cursor-pointer flex-col gap-2"
                href={`${ROUTES.client.trendGallery}/${i?._id}`}
                target="_blank"
              >
                <div className="relative flex aspect-[4/5] justify-center overflow-hidden rounded-xl">
                  <CustomImage
                    src={convertMediaUrl(i?.thumbnail)}
                    alt="Image"
                    className="!h-full !w-full !object-cover !transition-all !duration-300 group-hover:!scale-105"
                    width="100%"
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 text-green-400">
                    <VideoPlayerIcon className="size-16 min-h-14" />
                  </div>
                </div>

                <p className="text-base font-medium text-black md:text-lg">
                  {i?.reel_name}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  ) : null;
};

export default TrendGalleryList;
