"use client";

import CustomImage from "@components/CustomImage";
import { SxProps } from "@mui/material";
import {
  selectCitiesData,
  selectSelectedCity,
  selectSubCategories,
  setSelectedCity,
} from "@redux/slices/lookupSlice";
import { useAppDispatch } from "@redux/store/store";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  A11y,
  Autoplay,
  EffectCoverflow,
  Navigation,
  Scrollbar,
  Pagination as SwiperPagination,
} from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

const FetchStyledDropdown = dynamic(
  () => import("@components/FetchStyledDropdown"),
  { ssr: true },
);

const findVendorsDropdownSx: SxProps = {
  "& .MuiAutocomplete-popper": {
    fontSize: "14px !important",
    "@media (max-width: 768px)": {
      fontSize: "12px !important",
    },
    "@media (max-width: 480px)": {
      fontSize: "10px !important",
    },
  },
};

const findVendorsTextSx: SxProps = (customStyles: SxProps) => ({
  ...customStyles,
  "& .MuiInputBase-root": {
    ...customStyles["& .MuiInputBase-root"],
    padding: "10px 10px !important",
    backgroundColor: "#f7f7f7 !important",
    color: "inherit !important",
    fontSize: "14px",
    "@media (max-width: 768px)": {
      fontSize: "12px",
    },
    "@media (max-width: 480px)": {
      fontSize: "10px",
    },
  },
});

const VendorSearchBySubCategory = ({ item }) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <CustomImage
          src={item.image.src}
          height={"100%"}
          width={"100%"}
          className="!h-full !w-full rounded-2xl !object-cover"
        />
        <div className="via-black/400/20 absolute inset-0 w-fit bg-gradient-to-t from-transparent via-20% to-black/10" />
      </div>
    </div>
  );
};

interface HeroSectionProps {
  heroImages: {
    _id: number;
    image: any;
  }[];
  popularCategories: {
    _id: number;
    link: string;
    title: string;
  }[];
}

export default function HeroSection({
  heroImages,
  popularCategories,
}: HeroSectionProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const citiesData = useSelector(selectCitiesData);
  const selectedCity = useSelector(selectSelectedCity);
  const subCategoriesData = useSelector(selectSubCategories);

  const swiperRef = useRef<SwiperRef>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [vendorByCategoryAndCity, setVendorByCategoryAndCity] = useState({
    vendorType: null,
  });

  useEffect(() => {
    if (swiperRef.current) {
      if (isOpen) {
        swiperRef.current.swiper.autoplay.stop();
      } else {
        swiperRef.current.swiper.autoplay.start();
      }
    }
  }, [isOpen]);

  const handleDropdownChange = (key: string, data: any) => {
    setVendorByCategoryAndCity((prevState) => ({
      ...prevState,
      [key]: data,
    }));
  };

  const onClickSearch = () => {
    if (
      !isEmpty(vendorByCategoryAndCity?.vendorType)
      // && !isEmpty(vendorByCategoryAndCity?.city)
    ) {
      router.push(
        `${ROUTES.client.category}/${customEncodeURIComponent(vendorByCategoryAndCity?.vendorType?.name)}`,
      );
    } else {
      showToast("error", "Please select vendor type");
      // if (
      //   isEmpty(vendorByCategoryAndCity?.vendorType) &&
      //   isEmpty(vendorByCategoryAndCity?.city)
      // ) {
      //   showToast("error", "Please select vendor type and city");
      // } else if (isEmpty(vendorByCategoryAndCity?.vendorType)) {
      //   showToast("error", "Please select vendor type");
      // } else if (isEmpty(vendorByCategoryAndCity?.city)) {
      //   showToast("error", "Please select city");
      // }
    }
  };

  const handleCityDropdownChange = async (_, value) => {
    if (!isEmpty(value)) {
      dispatch(setSelectedCity(value));
    } else {
      dispatch(setSelectedCity(null));
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-[0_5px_30px_rgba(0,0,0,0.10)] lg:flex lg:h-[530px] lg:gap-6 xl:h-[500px] 2xl:h-[600px]">
      <div className="flex flex-col gap-y-5 px-4 py-6 md:py-12 lg:gap-y-12 xl:pl-8 xl:pr-3">
        <p className="text-xl font-semibold text-black sm:text-4xl lg:w-[350px] xl:w-[450px] xl:text-[32px]">
          Find the Perfect Vendors for <br className="hidden md:flex" />
          Your Special Event!
        </p>
        <div className="flex flex-col items-center gap-3 rounded-lg bg-white lg:gap-5 xl:max-w-[500px]">
          <div className="grid w-full grid-cols-1 items-center gap-3 xs:grid-cols-2 lg:grid-cols-1 lg:gap-5">
            <FetchStyledDropdown
              placeholder="Select Vendor Type"
              display="name"
              arr={subCategoriesData}
              getOpenState={setIsOpen}
              sx={findVendorsDropdownSx}
              textMenuSx={findVendorsTextSx}
              func={handleDropdownChange}
              objKey="vendorType"
              rootClassName="!m-0 relative"
              value={vendorByCategoryAndCity?.vendorType?._id}
              disablePortal={false}
            />
            <FetchStyledDropdown
              placeholder="All Cities"
              display="name"
              arr={citiesData}
              getOpenState={setIsOpen}
              sx={findVendorsDropdownSx}
              textMenuSx={findVendorsTextSx}
              func={handleCityDropdownChange}
              objKey="city"
              rootClassName="!m-0 relative"
              value={selectedCity?._id}
              disablePortal={false}
              disableClearable={false}
            />
          </div>

          <div className="flex w-full p-1">
            <button
              onClick={onClickSearch}
              className="h-auto w-full rounded-lg bg-green-400 py-1.5 text-xs text-white xs:px-3 xs:py-2 sm:px-5 sm:text-base lg:px-10"
            >
              Search
            </button>
          </div>
        </div>
        <p className="flex flex-wrap items-center gap-1 text-sm text-black">
          <b>Popular:</b>{" "}
          {popularCategories?.map((i, index) => (
            <p key={i?._id} className="flex items-center justify-between">
              <Link
                href={`${ROUTES.client.category}/${customEncodeURIComponent(i?.link)}`}
                className="capitalize hover:text-green-400"
              >
                {i?.title}
              </Link>
              {index < popularCategories.length - 1 && ", "}
            </p>
          ))}
        </p>
      </div>
      <Swiper
        ref={swiperRef}
        spaceBetween={30}
        speed={900}
        loop={true}
        coverflowEffect={{
          rotate: 5,
          depth: 5,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[
          Navigation,
          EffectCoverflow,
          SwiperPagination,
          Scrollbar,
          A11y,
          Autoplay,
        ]}
        className="eb-swiper !h-full !overflow-y-visible"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {heroImages.map((item) => (
          <SwiperSlide
            key={item._id}
            className="!cursor-grab active:!cursor-grabbing"
          >
            <VendorSearchBySubCategory item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
