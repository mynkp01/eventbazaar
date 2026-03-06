"use client";

import CustomImage from "@components/CustomImage";
import { convertMediaUrl } from "src/utils/helper";
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

interface PopularSearchesSectionProps {
  popularSearchData: any[];
}

export default function PopularSearchesSection({
  popularSearchData,
}: PopularSearchesSectionProps) {
  return (
    <Swiper
      spaceBetween={20}
      pagination={{ clickable: true }}
      speed={700}
      loop={true}
      modules={[Navigation, SwiperPagination, Scrollbar, A11y, Autoplay]}
      className="eb-swiper !h-full !w-full !rounded-xl"
      autoplay={{ delay: 2500, disableOnInteraction: false }}
    >
      {popularSearchData.map((item) => (
        <SwiperSlide key={item?._id}>
          <CustomImage
            src={convertMediaUrl(item.doc_path)}
            height="100%"
            width="100%"
            className="!h-full !max-h-[492px] !min-h-[492px] !w-full !object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
