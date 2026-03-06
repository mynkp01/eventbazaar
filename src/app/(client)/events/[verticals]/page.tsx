"use client";
import { apiHandler } from "@api/apiHandler";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import {
  selectSelectedCity,
  selectVerticalsAndEventTypes,
} from "@redux/slices/lookupSlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import {
  customDecodeURIComponent,
  customEncodeURIComponent,
} from "src/utils/helper.server";
import "swiper/css";
import "swiper/css/navigation";

const EventTypeCarousel = ({ verticals, eventTypes, slidesPerView = 8 }) => {
  const routes = useRouter();

  // const EventTypeCard = ({ event }) => (
  //   <div
  //     key={event?._id}
  //     onClick={() =>
  //       routes.push(
  //         `${ROUTES.client.verticals}/${customEncodeURIComponent(verticals)}/${customEncodeURIComponent(event?.event_type_name)}`,
  //       )
  //     }
  //     className="flex h-full w-full cursor-pointer flex-col items-center gap-1"
  //   >
  //     <div className="!aspect-[9/12] h-full !max-h-52 w-full !max-w-40 overflow-hidden rounded-lg border-4 border-yellow-200">
  //       <CustomImage
  //         src={`${process?.env?.NEXT_PUBLIC_BACKEND_API}${event?.doc_path}`}
  //         alt={event?.event_type_name}
  //         height={"100%"}
  //         width={"100%"}
  //         className="!object-cover transition-all duration-300 hover:scale-105"
  //       />
  //     </div>
  //     <p className="flex-1 text-center text-sm text-black-100 md:text-base">
  //       {event?.event_type_name}
  //     </p>
  //   </div>
  // );

  const EventTypeCard = ({ event }) => (
    <div
      key={event?._id}
      onClick={() =>
        routes.push(
          `${ROUTES.client.events}/${verticals}/${customEncodeURIComponent(event?.event_type_name)}`,
        )
      }
      className="h-full w-full rounded-xl bg-gray-100"
    >
      <div className="flex h-full w-auto flex-col justify-center whitespace-nowrap p-4 group-hover:bg-green-400/10 group-hover:text-green-400 md:p-6 xl:p-8">
        <p className="truncate text-base font-semibold text-black md:text-lg">
          {event?.event_type_name}
        </p>
        <p className="truncate text-sm font-normal text-black/80 md:text-base">
          {event?.subCategoryData
            ?.map((i) => i?.business_sub_category_name)
            ?.join(", ")}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* <Swiper
        style={{ zIndex: 0 }}
        loop={true}
        slidesPerView={8}
        spaceBetween={20}
        speed={2000}
        navigation={{
          nextEl: ".arrowright",
          prevEl: ".arrowleft",
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay, Navigation]}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 6,
          },
          1536: {
            slidesPerView,
          },
        }}
      >
        <div className="absolute inset-0 top-20 z-50 hidden h-fit justify-between gap-5 sm:flex">
          <div className="arrowleft relative p-0.5">
            <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 h-full w-full rounded-full bg-[linear-gradient(90deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)] shadow-xl transition-all duration-300 group-hover:rotate-180" />
            <RightArrowIcon className="h-8 w-8 !cursor-pointer rounded-full bg-white p-1 hover:bg-gray-200" />
          </div>
          <div className="arrowright relative p-0.5">
            <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 h-full w-full rounded-full bg-[linear-gradient(90deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)] shadow-xl transition-all duration-300 group-hover:rotate-180" />
            <LeftArrowIcon className="h-8 w-8 !cursor-pointer rounded-full bg-white p-1 hover:bg-gray-200" />
          </div>
        </div>
        {eventTypes?.map((event) => (
          <SwiperSlide key={event?._id}>
            <EventTypeCard event={event} />
          </SwiperSlide>
        ))}
      </Swiper> */}
      <div className="grid gap-3 md:gap-4 lg:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {eventTypes?.map((event) => (
          <div
            key={event?._id}
            className="group relative h-full w-full cursor-pointer overflow-hidden rounded-xl p-[1px]"
          >
            <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 h-full w-full rounded-xl bg-[linear-gradient(90deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)] transition-all duration-300"></div>
            <EventTypeCard event={event} />
          </div>
        ))}
      </div>
    </>
  );
};

const Verticals = () => {
  const DATA_LENGTH = 4;

  const verticalsAndEventTypesData = useSelector(selectVerticalsAndEventTypes);
  const selectedCity = useSelector(selectSelectedCity);

  const routes = useRouter();
  const { verticals }: { [key: string]: string } = useParams();
  const EVENT_VERTICAL_NAME = customDecodeURIComponent(verticals as string);

  const [totalPages, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const [verticalsDetails, setVerticalsDetails] = useState(null);
  const [totalRecordCount, setTotalRecordCount] = useState(1);

  useEffect(() => {
    if (!isEmpty(verticals)) {
      setNotFoundMessage("");
      fetchEventVerticals();
    }
  }, [verticalsAndEventTypesData, verticals, selectedCity]);

  const fetchEventVerticals = async () => {
    try {
      const { data, status } =
        await apiHandler.eventType.eventVerticalAndEventType(
          `location_id=${selectedCity?._id}&limit=500`,
        );
      if (status === 200 || status === 201) {
        const verticalsDataByFind = data?.data?.find(
          (i) =>
            i?.event_vertical_name?.toLowerCase() ===
            EVENT_VERTICAL_NAME?.toLowerCase(),
        );

        if (isEmpty(verticalsDataByFind)) {
          setNotFoundMessage(`${EVENT_VERTICAL_NAME} Vertical Not Available`);
        } else {
          setVerticalsDetails(verticalsDataByFind);
          setTotalRecordCount(verticalsDataByFind?.["event-types"]?.length);
          setTotalPage(
            Math.ceil(
              verticalsDataByFind?.["event-types"]?.length / DATA_LENGTH,
            ),
          );
        }
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handlePageChange = (_e, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex flex-col gap-2 md:gap-4 lg:gap-6 xl:gap-8">
      <div className="flex flex-col gap-2 px-6 py-6 sm:px-12 md:gap-4 md:px-24 md:pb-0 lg:gap-6 xl:gap-8">
        <div className="flex flex-col gap-2">
          <Breadcrumb />
          <p className="heading-40 capitalize">{EVENT_VERTICAL_NAME}</p>
        </div>

        <div className="flex min-w-full flex-col gap-2 md:gap-4 lg:gap-6 xl:gap-8">
          <div className="rounded-lg">
            <CustomImage
              src={convertMediaUrl(verticalsDetails?.horizontal_path)}
              width={"100%"}
              height={"100%"}
              className="!h-72 !rounded-[20px] !object-cover md:!h-96"
            />
          </div>
          <p className="heading-40 capitalize">
            Search {EVENT_VERTICAL_NAME} Event Vendors By Event Types
          </p>
          <EventTypeCarousel
            verticals={verticals}
            eventTypes={verticalsDetails?.["event-types"]}
            slidesPerView={8}
          />
        </div>
      </div>
    </div>
  );
};

export default Verticals;
