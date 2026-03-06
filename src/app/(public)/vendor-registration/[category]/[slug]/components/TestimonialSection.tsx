"use client";

import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface TrustedBySection {
  _id: number;
  section: string;
  fullName: string;
  designation: string;
  companyName: string;
}

interface TestimonialSectionProps {
  testimonials: TrustedBySection[];
}

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: TrustedBySection;
}) => (
  <div key={testimonial?._id} className="!flex !h-full !px-5">
    <div className="flex flex-col justify-between overflow-hidden rounded-[10px] border border-white-200 bg-white shadow-[0px_10px_20px_0px_#0000001A]">
      <p className="p-5">{testimonial?.section}</p>
      <div className="flex flex-col gap-2 rounded-tl-xl rounded-tr-xl bg-green-400 px-5 py-4 text-sm font-medium text-white">
        <p className="text-xl">{testimonial?.fullName}</p>
        <div>
          <p>{testimonial?.designation}&nbsp;</p>
          <p>{testimonial?.companyName}&nbsp;</p>
        </div>
      </div>
    </div>
  </div>
);

export default function TestimonialSection({
  testimonials,
}: TestimonialSectionProps) {
  return (
    <>
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{
          clickable: true,
          el: ".custom-swiper-pagination",
        }}
        style={{ zIndex: 0 }}
        speed={700}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        slidesPerView="auto"
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1440: {
            slidesPerView: 4,
          },
        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial._id} className="!h-auto">
            <TestimonialCard testimonial={testimonial} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-swiper-pagination mt-4 flex justify-center" />
    </>
  );
}
