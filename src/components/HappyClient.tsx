"use client";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import CustomImage from "./CustomImage";

const HappyClient = ({ testimonialsData }) => {
  const swiperRef = useRef<SwiperRef>(null);

  const [selectedTestimonialIndex, setSelectedTestimonialIndex] = useState(0);

  const handleImageClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-6 sm:px-12 md:px-24 lg:gap-6 xl:gap-8">
      <div className="flex flex-col gap-2">
        <p className="heading-40">Feelings of Our Happy Client's</p>
        {/* <p className="text-sm text-gray-500">
          It is a long established fact that a reader will be distracted by the
          readable content.
        </p> */}
      </div>

      <div className="hidden gap-3 md:flex xl:justify-between">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`relative flex size-24 cursor-pointer overflow-hidden rounded-full border-2 duration-300 sm:size-32 md:h-fit ${
              selectedTestimonialIndex === index
                ? "border-green-400"
                : "border-transparent"
            } ${index % 2 === 0 ? "sm:mt-14 lg:mt-20 xl:mt-32" : "sm:mb-14 lg:mb-20 xl:mb-32"}`}
            style={{
              "@media (minWidth: 768px)": {
                height: index % 2 === 0 ? "8rem" : "6rem",
                width: index % 2 === 0 ? "8rem" : "6rem",
              },
            }}
            onClick={() => handleImageClick(index)}
          >
            <CustomImage
              src={testimonial.image}
              alt={testimonial.name}
              className="!size-full !rounded-full !object-cover !p-1 lg:!p-2"
            />
          </div>
        ))}
      </div>

      <div className="eb-testimonial flex flex-col items-center">
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="eb-swiper w-full"
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          onSlideChange={(e) => setSelectedTestimonialIndex(e.realIndex)}
        >
          {testimonialsData.map((testimonial, index) => (
            <SwiperSlide
              key={testimonial.id}
              className="!flex !flex-col !gap-2"
            >
              <div
                key={testimonial.id}
                className={`relative size-24 cursor-pointer overflow-hidden rounded-full border-2 duration-300 sm:size-32 md:hidden ${
                  selectedTestimonialIndex === index
                    ? "border-green-400"
                    : "border-transparent"
                }`}
                style={{
                  "@media (minWidth: 768px)": {
                    height: index % 2 === 0 ? "8rem" : "6rem",
                    width: index % 2 === 0 ? "8rem" : "6rem",
                  },
                }}
                onClick={() => handleImageClick(index)}
              >
                <CustomImage
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-full w-full rounded-full object-cover p-2"
                />
              </div>
              <p className="text-wrap text-xl font-medium sm:text-2xl">
                {testimonial.text}
              </p>
              <p className="text-wrap text-gray-700">{testimonial.name}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HappyClient;
