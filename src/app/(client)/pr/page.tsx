"use client";
import {
  AkilaNews,
  Dhabkar,
  DivyaBhaskar,
  EbManagement,
  EbManagement1,
  Gallery1,
  Gallery2,
  Gallery3,
  Gallery4,
  Gallery5,
  Gallery6,
  NavgujaratSamay,
  NavgujaratTimes,
  NewsNation,
  Rakheval,
  Venus,
} from "@assets/index";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ClientLogo = [
  { _id: 0, item: NavgujaratTimes.src },
  { _id: 1, item: NavgujaratSamay.src },
  { _id: 2, item: NewsNation.src },
  { _id: 3, item: AkilaNews.src },
  { _id: 4, item: DivyaBhaskar.src },
  { _id: 5, item: Venus.src },
  { _id: 6, item: Dhabkar.src },
  { _id: 7, item: Rakheval.src },
];

function PR() {
  return (
    <>
      <div className="flex flex-col gap-5 px-6 pt-6 lg:px-24">
        <div>
          <Breadcrumb />
          <div className="text-[38px] font-medium capitalize">
            Press Release
          </div>
        </div>
        <div className="flex flex-col gap-10 md:gap-16">
          <div className="grid items-center justify-between gap-10 md:grid-cols-2">
            <div>
              <CustomImage
                src={EbManagement.src}
                alt="EducationalBanner"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col gap-10 xl:max-w-[70%]">
              <div className="flex flex-col gap-6">
                <h3 className="heading-40 text-base/8 font-medium capitalize text-black-200 md:text-3xl lg:text-4xl">
                  Press Conference - Introducing a New Era for Event Vendors
                </h3>
                <div className="flex flex-col gap-6 text-grey-50">
                  <p>
                    We held an exclusive press conference to announce the launch
                    of EventBazaar.com, a platform built to transform how event
                    vendors connect with clients.
                  </p>
                  <p>
                    Industry experts, media professionals, and event planners
                    attended the event to get a first look at our vision, a
                    centralized, easy-to-use marketplace where all types of
                    event vendors can showcase their services and get
                    discovered.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid items-center justify-between gap-10 md:grid-cols-2">
            <div className="order-2 flex flex-col gap-6 pt-6 md:order-1 xl:max-w-[70%]">
              <div className="flex flex-col gap-6">
                <h3 className="heading-40 text-base/8 font-medium capitalize text-black-200 md:text-3xl lg:text-4xl">
                  Launch of EventBazaar.com. We’re Live! Vendors, It’s Time to
                  Shine
                </h3>
                <div className="flex flex-col gap-6 text-grey-50">
                  <p>
                    We have announced the launch of EventBazaar.com, a dedicated
                    platform for event vendors to connect with potential clients
                    and grow their business online.
                  </p>
                  <p>
                    Whether you are just starting out or have years of
                    experience in the industry, EventBazaar.com helps you stand
                    out in a crowded marketplace.
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <CustomImage
                src={EbManagement1.src}
                alt="EducationalBanner"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className="heading-40 font-medium">
                Press Conference Coverage
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-base text-gray-500">
                  The event was featured in leading publications, highlighting
                  our mission to build a dedicated platform where event vendors
                  can grow their presence and connect with clients more
                  effectively.
                </p>
                <p className="text-base text-gray-500">
                  The article covered key moments from the press event,
                  including the announcement of our vendor-first marketplace and
                  a glimpse into how EventBazaar.com helps vendors generate
                  quality leads.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <CustomImage
                  src={Gallery1.src}
                  alt="EducationalBanner"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col gap-5">
                <CustomImage
                  src={Gallery2.src}
                  alt="EducationalBanner"
                  className="h-full w-full rounded-lg object-cover"
                />
                <CustomImage
                  src={Gallery3.src}
                  alt="EducationalBanner"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
              <div>
                <CustomImage
                  src={Gallery4.src}
                  alt="EducationalBanner"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col gap-5">
                <CustomImage
                  src={Gallery5.src}
                  alt="EducationalBanner"
                  className="h-full w-full rounded-lg object-cover"
                />
                <CustomImage
                  src={Gallery6.src}
                  alt="EducationalBanner"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
            {/* <div className="text-center">
              <Link
                href={""}
                className="w-full rounded-xl border bg-green-400 px-14 py-3 text-center text-white transition-all duration-300 hover:border-green-400 hover:bg-transparent hover:text-green-400 md:w-fit"
              >
                View All
              </Link>
            </div> */}
          </div>
        </div>
      </div>
      <div className="mt-20 py-10">
        <p className="heading-40 mb-10 text-center font-medium">Featured in</p>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
          modules={[Autoplay]}
          className="!h-fit"
        >
          {ClientLogo.map((item, index) => (
            <SwiperSlide key={item._id}>
              <div className="flex h-full items-center justify-center">
                <CustomImage
                  src={item.item}
                  width={200}
                  height={100}
                  alt="ClientLogo"
                  className="h-full w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default PR;
